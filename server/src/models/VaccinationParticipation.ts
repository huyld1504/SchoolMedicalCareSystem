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

// Text search indexes cho search với keyword
schema.index({
  parentNote: 'text',
  nurseNote: 'text'
}, {
  name: 'vaccination_participation_text_search',
  weights: {
    parentNote: 5,
    nurseNote: 8
  }
});

// Indexes for performance
schema.index({ campaign: 1, student: 1 }, { unique: true }); // Một học sinh chỉ tham gia một lần per campaign
schema.index({ parentConsent: 1 });
schema.index({ vaccinationStatus: 1 });
schema.index({ campaign: 1, parentConsent: 1 });
schema.index({ campaign: 1, vaccinationStatus: 1 });
schema.index({ student: 1, createdAt: -1 });
schema.index({ parentConsentDate: 1 });
schema.index({ vaccinationDate: 1 });

export const VaccinationParticipation: IVaccinationParticipationModel = model<IVaccinationParticipation, IVaccinationParticipationModel>('VaccinationParticipation', schema);