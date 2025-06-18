import { Document, model, Model, Schema, Types } from 'mongoose';

export interface IVaccinationCampaign extends Document {
  // Loại vaccine
  vaccineName: string;
  vaccineType: string;

  // Đối tượng tiêm
  targetAudience: string; // Ví dụ: "Học sinh lớp 1-3", "Toàn bộ học sinh", "Học sinh từ 6-12 tuổi"

  // Thời gian bắt đầu
  startDate: Date;

  // Trạng thái chiến dịch
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';

  // Người tạo
  createdBy: Types.ObjectId; // Admin tạo chiến dịch
}

interface IVaccinationCampaignModel extends Model<IVaccinationCampaign> { };

const schema = new Schema({
  // Loại vaccine
  vaccineName: { type: String, required: true }, // Tên vaccine cụ thể
  vaccineType: { type: String, required: true }, // Loại vaccine (phòng bệnh gì)

  // Đối tượng tiêm
  targetAudience: { type: String, required: true },

  // Thời gian bắt đầu
  startDate: { type: Date, required: true },

  // Trạng thái chiến dịch
  status: {
    type: String,
    enum: ['planned', 'ongoing', 'completed', 'cancelled'],
    default: 'planned'
  },

  // Người tạo
  createdBy: { type: Types.ObjectId, ref: "User", required: true }
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
});

// Text search indexes để tối ưu keyword search
schema.index({
  vaccineName: 'text',
  vaccineType: 'text',
  targetAudience: 'text'
}, {
  name: 'vaccination_campaign_text_search',
  weights: {
    vaccineName: 10,
    vaccineType: 5,
    targetAudience: 3
  }
});

// Compound indexes cho filter hiệu quả
schema.index({ status: 1, startDate: -1 });
schema.index({ createdBy: 1, status: 1 });
schema.index({ startDate: 1 });

export const VaccinationCampaign: IVaccinationCampaignModel = model<IVaccinationCampaign, IVaccinationCampaignModel>("VaccinationCampaign", schema);
