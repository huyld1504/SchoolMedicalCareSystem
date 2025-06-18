import { Document, model, Model, Schema, Types } from 'mongoose';

export interface IVaccinationParticipation extends Document {
  // Liên kết
  campaign: Types.ObjectId;  // Chiến dịch tiêm chủng
  student: Types.ObjectId;   // Học sinh tham gia
  // Quy trình phụ huynh
  parentConsent: 'pending' | 'approved' | 'denied';  // Đồng ý của phụ huynh
  parentNote?: string;       // Ghi chú từ phụ huynh
  parentConsentDate?: Date;  // Ngày phụ huynh phản hồi
  // Quy trình tiêm chủng
  vaccinationStatus: 'scheduled' | 'completed' | 'missed' | 'cancelled';  // Trạng thái tiêm
  vaccinationDate?: Date;    // Ngày thực hiện tiêm
  vaccinatedNurse?: Types.ObjectId;  // Y tá thực hiện (chỉ có khi completed)
  nurseNote?: string;        // Ghi chú từ y tá
  // Quản lý
  createdBy: Types.ObjectId; // Admin thêm học sinh vào chiến dịch
}

interface IVaccinationParticipationModel extends Model<IVaccinationParticipation> { };

const schema = new Schema({
  // Liên kết
  campaign: { type: Types.ObjectId, ref: 'VaccinationCampaign', required: true },
  student: { type: Types.ObjectId, ref: 'Child', required: true },
  // Quy trình phụ huynh
  parentConsent: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  },
  parentNote: { type: String },
  parentConsentDate: { type: Date },
  // Quy trình tiêm chủng
  vaccinationStatus: {
    type: String,
    enum: ['scheduled', 'completed', 'missed', 'cancelled'],
    default: 'scheduled'
  },
  vaccinationDate: { type: Date },
  vaccinatedNurse: { type: Types.ObjectId, ref: 'User' },
  nurseNote: { type: String },
  // Quản lý
  createdBy: { type: Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

/**
 * 🔍 TEXT SEARCH INDEX - Notes search optimization
 * 
 * Mục đích: Search trong notes của parent và nurse
 * 
 * Fields indexed:
 * - nurseNote: Weight 8 (medical notes quan trọng hơn)
 * - parentNote: Weight 5 (parent feedback)
 * 
 * Use cases:
 * - Search medical notes: "dị ứng", "phản ứng", "sốt"
 * - Search parent concerns: "lo lắng", "đồng ý", "từ chối"
 * 
 * Performance: Enables text search trong notes
 */
schema.index({
  parentNote: 'text',
  nurseNote: 'text'
}, {
  name: 'vaccination_participation_text_search',
  weights: {
    parentNote: 5,    // Parent feedback
    nurseNote: 8      // Medical notes quan trọng hơn
  }
});

/**
 * 🔑 UNIQUE CONSTRAINT INDEX - Business rule enforcement
 * 
 * Rule: Một học sinh chỉ được tham gia một lần per campaign
 * Performance: Also optimizes campaign + student lookups
 */
schema.index({ campaign: 1, student: 1 }, {
  unique: true,
  name: 'campaign_student_unique'
});

/**
 * 📊 SINGLE FIELD INDEXES - Status filtering optimization
 */

// Parent consent filtering
// Query pattern: { parentConsent: "pending" }
schema.index({ parentConsent: 1 }, {
  name: 'parent_consent_filter'
});

// Vaccination status filtering  
// Query pattern: { vaccinationStatus: "scheduled" }
schema.index({ vaccinationStatus: 1 }, {
  name: 'vaccination_status_filter'
});

/**
 * 🔗 COMPOUND INDEXES - Multi-field query optimization
 */

// Campaign + parent consent filtering (common nurse query)
// Query pattern: { campaign: ObjectId, parentConsent: "approved" }
schema.index({ campaign: 1, parentConsent: 1 }, {
  name: 'campaign_consent_compound'
});

// Campaign + vaccination status filtering (common admin query)
// Query pattern: { campaign: ObjectId, vaccinationStatus: "completed" }
schema.index({ campaign: 1, vaccinationStatus: 1 }, {
  name: 'campaign_status_compound'
});

// Student timeline (parent view - xem lịch sử tiêm của con)
// Query pattern: { student: ObjectId } sorted by createdAt desc
schema.index({ student: 1, createdAt: -1 }, {
  name: 'student_timeline'
});

/**
 * 📅 DATE INDEXES - Temporal queries optimization
 */

// Parent consent date filtering
// Query pattern: { parentConsentDate: { $gte: date, $lte: date } }
// Note: Chỉ cần index nếu có query theo date range
schema.index({ parentConsentDate: 1 }, {
  name: 'parent_consent_date'
});

// Vaccination date filtering (reports, statistics)
// Query pattern: { vaccinationDate: { $gte: date, $lte: date } }
// Note: Chỉ cần index nếu có query theo date range
schema.index({ vaccinationDate: 1 }, {
  name: 'vaccination_date'
});

export const VaccinationParticipation: IVaccinationParticipationModel = model<IVaccinationParticipation, IVaccinationParticipationModel>('VaccinationParticipation', schema);