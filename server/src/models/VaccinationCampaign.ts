import { Document, model, Model, Schema, Types } from 'mongoose';

export interface IVaccinationCampaign extends Document {
  // Loại vaccine
  vaccineName: string;
  vaccineType: string;
  vaccineDescription: string; // Mô tả chi tiết về vaccine (optional)
  dosage: number; // Liều lượng vaccine (optional)
  injection: number; // Cách tiêm (tiêm bắp, tiêm dưới da, etc.)
  // Đối tượng tiêm
  targetAudience: string; // Ví dụ: "Học sinh lớp 1-3", "Toàn bộ học sinh"
  // Thời gian bắt đầu và kết thúc
  startDate: Date;
  endDate: Date;
  // Trạng thái chiến dịch
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  // Người tạo
  createdBy: Types.ObjectId; // Admin tạo chiến dịch
}

type IVaccinationCampaignModel = Model<IVaccinationCampaign>;

const schema = new Schema({
  // Loại vaccine
  vaccineName: { type: String, required: true },
  vaccineType: { type: String, required: true },
  vaccineDescription: { type: String, required: true },
  dosage: { type: Number, required: true },
  injection: { type: Number, required: true },
  // Đối tượng tiêm
  targetAudience: { type: String, required: true },
  // Thời gian bắt đầu và kết thúc
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  // Trạng thái chiến dịch
  status: {
    type: String,
    enum: ['planned', 'ongoing', 'completed', 'cancelled'],
    default: 'planned',
  },
  // Người tạo
  createdBy: { type: Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

/**
 * 🔍 TEXT SEARCH INDEX - Multi-field keyword search optimization
 * 
 * Mục đích: Tối ưu hóa text search với weighted relevance scoring
 * 
 * Fields indexed:
 * - vaccineName: Weight 10 (highest priority)
 * - vaccineType: Weight 5 (medium priority)  
 * - targetAudience: Weight 3 (lowest priority)
 * 
 * Use cases:
 * - Keyword search: "COVID", "Hepatitis B", "học sinh lớp 1"
 * - Admin/nurse search campaigns by vaccine name/type
 * - Filter by target audience
 * 
 * Performance: Enables $text queries với relevance scoring
 */
// schema.index({
//   vaccineName: 'text',
//   vaccineType: 'text',
//   targetAudience: 'text'
// }, {
//   name: 'vaccination_campaign_text_search',
//   weights: {
//     vaccineName: 10,    // Vaccine name là quan trọng nhất
//     vaccineType: 5,     // Vaccine type quan trọng thứ hai
//     targetAudience: 3   // Target audience ít quan trọng hơn
//   }
// });

// /**
//  * 📊 COMPOUND INDEXES - Query optimization cho common access patterns
//  */

// // Index cho nurse role filtering (chỉ xem planned/ongoing campaigns)
// // Query pattern: { status: { $in: ["planned", "ongoing"] }, 
// //   startDate: { $gte: date } }
// schema.index({ status: 1, startDate: -1 }, {
//   name: 'status_startdate_compound'
// });

// // Index cho admin view campaigns by creator và status
// // Query pattern: { createdBy: ObjectId, status: "planned" }
// schema.index({ createdBy: 1, status: 1 }, {
//   name: 'creator_status_compound'
// });

// // Index cho date range queries
// // Query pattern: { startDate: { $gte: startDate, $lte: endDate } }
// schema.index({ startDate: 1 }, {
//   name: 'startdate_single'
// });

export const VaccinationCampaign: IVaccinationCampaignModel = model<IVaccinationCampaign, IVaccinationCampaignModel>('VaccinationCampaign', schema);
