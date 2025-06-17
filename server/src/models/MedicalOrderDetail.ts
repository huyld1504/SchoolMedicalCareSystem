import { Document, Model, Schema, Types, model } from "mongoose";

export interface IMedicalOrderDetail extends Document {
  medicalOrderId: Types.ObjectId;
  medicineName: string;
  dosage: string;
  type: string;
  time: string;
  note: string;
  quantity: number;
}

interface IMedicalOrderDetailModel extends Model<IMedicalOrderDetail> {}
const schema = new Schema(
  {
    medicalOrderId: {
      type: Types.ObjectId,
      ref: "MedicalOrder",
      required: true,
    },
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    type: { type: String, required: true },
    time: { type: String, required: true },
    note: { type: String },
    quantity: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
export const MedicalOrderDetail: IMedicalOrderDetailModel = model<
  IMedicalOrderDetail,
  IMedicalOrderDetailModel
>("MedicalOrderDetail", schema);
