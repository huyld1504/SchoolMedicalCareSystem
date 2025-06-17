
import { model, Model, Schema, Types } from 'mongoose';
import { Document } from 'typeorm';

export interface IVaccinationCampaign extends Document {
  id: string,
  user: Types.ObjectId,
  vaccineType: string,
  vaccinatedDate: Date,
  vaccineName: string,
}

interface IVaccinationCampaignModel extends Model<IVaccinationCampaign> {};

const schema = new Schema({
  user: {type: Types.ObjectId, ref: "User", require: true},
  vaccineType: {type: String, require: true},
  vaccinatedDate: {type: Date, require: true},
  vaccineName: {type: String, require: true},
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
});

export const VaccinationCampaign: IVaccinationCampaignModel = model<IVaccinationCampaign, IVaccinationCampaignModel>("VaccinationCampaign", schema);
