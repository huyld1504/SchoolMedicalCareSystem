/**
 * Test script để kiểm tra business rules cho vaccination APIs
 * Chạy với: npm run test:vaccination-rules
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { VaccinationParticipationRepository } from '@src/repos/VaccinationParticipationRepo';
import { parentConsentSchema, nurseRecordSchema } from '@src/schemas/vaccination.schema';
import { Types } from 'mongoose';

describe('Vaccination Business Rules Tests', () => {
  let repo: VaccinationParticipationRepository;

  beforeEach(() => {
    repo = new VaccinationParticipationRepository();
  });

  describe('Parent Consent Validation', () => {
    it('should validate approved consent without note', () => {
      const result = parentConsentSchema.validate({
        consent: 'approved'
      });
      expect(result.error).toBeUndefined();
    });

    it('should validate approved consent with note', () => {
      const result = parentConsentSchema.validate({
        consent: 'approved',
        note: 'Con tôi sẵn sàng tiêm chủng'
      });
      expect(result.error).toBeUndefined();
    });

    it('should validate denied consent with empty note (will be validated at repo level)', () => {
      const result = parentConsentSchema.validate({
        consent: 'denied',
        note: ''
      });
      expect(result.error).toBeUndefined(); // Schema allows empty string
    });

    it('should validate denied consent with meaningful note', () => {
      const result = parentConsentSchema.validate({
        consent: 'denied',
        note: 'Con tôi bị dị ứng với vaccine này'
      });
      expect(result.error).toBeUndefined();
    });
  });

  describe('Nurse Record Validation', () => {
    it('should validate completed status without vaccinationDate', () => {
      const result = nurseRecordSchema.validate({
        status: 'completed'
      });
      expect(result.error).toBeUndefined(); // vaccinationDate will be auto-set
    });

    it('should validate completed status with note', () => {
      const result = nurseRecordSchema.validate({
        status: 'completed',
        note: 'Học sinh đã tiêm chủng thành công'
      });
      expect(result.error).toBeUndefined();
    });

    it('should validate missed status', () => {
      const result = nurseRecordSchema.validate({
        status: 'missed',
        note: 'Học sinh không có mặt'
      });
      expect(result.error).toBeUndefined();
    });

    it('should validate cancelled status', () => {
      const result = nurseRecordSchema.validate({
        status: 'cancelled',
        note: 'Hủy theo yêu cầu phụ huynh'
      });
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid status', () => {
      const result = nurseRecordSchema.validate({
        status: 'invalid-status'
      });
      expect(result.error).toBeDefined();
    });

    it('should validate empty note', () => {
      const result = nurseRecordSchema.validate({
        status: 'completed',
        note: ''
      });
      expect(result.error).toBeUndefined(); // Empty note is allowed
    });
  });

  describe('Query Parameters Validation', () => {
    // Import participationQuerySchema for testing
    const { participationQuerySchema } = require('@src/schemas/vaccination.schema');

    it('should validate empty query parameters', () => {
      const result = participationQuerySchema.validate({
        keyword: '',
        parentConsent: '',
        vaccinationStatus: '',
        campaignId: '',
        studentId: ''
      });
      expect(result.error).toBeUndefined();
    });

    it('should validate valid query parameters', () => {
      const result = participationQuerySchema.validate({
        keyword: 'vaccine',
        parentConsent: 'approved',
        vaccinationStatus: 'completed',
        page: 1,
        limit: 10
      });
      expect(result.error).toBeUndefined();
    });

    it('should validate mixed empty and filled parameters', () => {
      const result = participationQuerySchema.validate({
        keyword: 'vaccine', // has value
        parentConsent: '',   // empty
        vaccinationStatus: 'completed', // has value
        campaignId: '',      // empty
        page: 1,
        limit: 10
      });
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid enum values', () => {
      const result = participationQuerySchema.validate({
        parentConsent: 'invalid-consent'
      });
      expect(result.error).toBeDefined();
    });
  });

  describe('Business Logic Simulation', () => {
    it('should simulate auto-date setting for completed vaccination', () => {
      // Simulate what happens in recordVaccination method
      const status = 'completed';
      const nurseId = new Types.ObjectId().toString();
      
      const updateData: any = {
        vaccinationStatus: status,
      };

      if (status === 'completed') {
        updateData.vaccinationDate = new Date();
        updateData.vaccinatedNurse = new Types.ObjectId(nurseId);
      }

      expect(updateData.vaccinationDate).toBeDefined();
      expect(updateData.vaccinatedNurse).toBeDefined();
      expect(updateData.vaccinationStatus).toBe('completed');
    });

    it('should simulate parent consent denied validation', () => {
      // Simulate what happens in updateParentConsent method
      const consent = 'denied';
      const note = ''; // Empty note

      const hasValidNote = note && note.trim().length > 0;
      const shouldThrowError = consent === 'denied' && !hasValidNote;

      expect(shouldThrowError).toBe(true);
    });

    it('should simulate parent consent approved without note', () => {
      // Simulate what happens in updateParentConsent method
      const consent = 'approved';
      const note = undefined;

      const hasValidNote = note && note.trim().length > 0;
      const shouldThrowError = consent === 'denied' && !hasValidNote;

      expect(shouldThrowError).toBe(false); // Should not throw error
    });
  });
});

// Test data examples for manual testing
export const testCases = {
  parentConsent: {
    approvedWithoutNote: {
      consent: 'approved'
    },
    approvedWithNote: {
      consent: 'approved',
      note: 'Con tôi sẵn sàng tiêm chủng'
    },
    deniedWithNote: {
      consent: 'denied',
      note: 'Con tôi bị dị ứng với vaccine này'
    },
    deniedWithoutNote: {
      consent: 'denied'
      // Should cause error at repository level
    }
  },
  
  nurseRecord: {
    completed: {
      status: 'completed',
      note: 'Học sinh đã tiêm chủng thành công'
    },
    completedWithoutNote: {
      status: 'completed'
    },
    missed: {
      status: 'missed',
      note: 'Học sinh không có mặt'
    },
    cancelled: {
      status: 'cancelled',
      note: 'Hủy theo yêu cầu phụ huynh'
    }
  },

  queryParams: {
    empty: {
      keyword: '',
      parentConsent: '',
      vaccinationStatus: ''
    },
    filled: {
      keyword: 'vaccine',
      parentConsent: 'approved',
      vaccinationStatus: 'completed'
    },
    mixed: {
      keyword: 'vaccine',
      parentConsent: '',
      vaccinationStatus: 'completed',
      page: 1,
      limit: 10
    }
  }
};
