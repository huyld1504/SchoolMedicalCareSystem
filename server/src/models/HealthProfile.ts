import { Document, Model, Schema, Types, model } from "mongoose";

export interface IHealthProfile extends Document {
  studentId: Types.ObjectId;
  height: number;
  weight: number;
  bloodType: string;
  vision: string;
  allergies: string;
  chronicDiseases: string;
  devicesSupport: string;
  UserId: Types.ObjectId;
}

interface IIHealthProfileModel extends Model<IHealthProfile> {}

const schema = new Schema(
  {
    studentId: { type: Types.ObjectId, ref: "Child", required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    bloodType: { type: String, required: true },
    vision: { type: String, required: true },
    allergies: { type: String, required: true },
    chronicDiseases: { type: String, required: true },
    devicesSupport: { type: String, required: true },
    UserId: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const HealthProfile: IIHealthProfileModel = model<
  IHealthProfile,
  IIHealthProfileModel
>("HealthProfile", schema);
