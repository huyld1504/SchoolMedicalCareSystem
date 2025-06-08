import { PaginationResult } from "@src/common/interfaces/mongo.interface";
import { IMedicalEvent } from "@src/models/MedicalEvent";
import { BaseQueryBuilder } from "@src/payload/request/filter/base.request";
import { MedicalEventRepository } from "@src/repos/MedicalEventRepo";

class MedicalEventService {
  private repo = new MedicalEventRepository();

  /**
   * Get all medical events.
   * @return A promise that resolves to an array of medical events.
   */
  async getAllMedicalEvents(query: BaseQueryBuilder): Promise<PaginationResult<IMedicalEvent>> {
    return this.repo.getAllMedicalEvents(query);
  }

  /** 
   * Get all medical events for a specific student by their ID.
   * @param studentId - The ID of the student to get medical events for.
   * @param query - The query parameters for pagination and filtering.
   * @return A promise that resolves to a pagination result containing medical events.
  */
  async getMedicalEventsByStudentId(studentId: string, query: BaseQueryBuilder): Promise<PaginationResult<IMedicalEvent>>{
    return this.repo.getMedicalEventsByStudentId(studentId, query);
  }

  /**
   * Get a medical event by its ID.
   * @param eventId - The ID of the medical event to retrieve.
   * @return A promise that resolves to the medical event or null if not found.
   */
  async getMedicalEventById(eventId: string): Promise<IMedicalEvent | null> {
    return this.repo.getMedicalEventById(eventId);
  }

  /**
   * Create a new medical event.
   * @param data - The data for the new medical event.
   * @return A promise that resolves when the medical event is created.
   */
  async createMedicalEvent(data: IMedicalEvent, userId: string): Promise<void> {
    return this.repo.createMedicalEvent(data, userId);
  }

  /**
   * Update a medical event by its ID.
   * @param eventId - The ID of the medical event to update.
   * @param data - The data to update the medical event with.
   * @return A promise that resolves to the updated medical event or null if not found.
   */
  async updateMedicalEvent(eventId: string, data: IMedicalEvent): Promise<IMedicalEvent | null> {
    return this.repo.updateMedicalEvent(eventId, data);
  }

  /**
   * Delete a medical event by its ID.
   * @param eventId - The ID of the medical event to delete.
   * @return A promise that resolves to the deleted medical event or null if not found.
   */
  async deleteMedicalEvent(eventId: string): Promise<IMedicalEvent | null> {
    return this.repo.deleteMedicalEvent(eventId);
  }
}

const medicalEventService = new MedicalEventService();
export default medicalEventService as MedicalEventService;