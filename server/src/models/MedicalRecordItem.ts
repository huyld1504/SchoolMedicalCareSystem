import { Document, Model, Schema, Types, model } from "mongoose";

export interface IMedicalRecordItem extends Document {
  medicalRecordId: Types.ObjectId;
  name: string;
  quantity: number;
}
interface IMedicalRecordItemModel extends Model<IMedicalRecordItem> {}
const schema = new Schema(
  {
    medicalRecordId: {
      type: Types.ObjectId,
      ref: "MedicalRecord",
      required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
export const MedicalRecordItem: IMedicalRecordItemModel = model<
  IMedicalRecordItem,
  IMedicalRecordItemModel
>("MedicalRecordItem", schema);
