import { Document, Model, Schema, Types, model } from "mongoose";

export interface IMedicalRecord extends Document {
  medicalOrderId: Types.ObjectId;
  userId: Types.ObjectId;
}
interface IMedicalRecordModel extends Model<IMedicalRecord> {}
const schema = new Schema(
  {
    medicalOrderId: {
      type: Types.ObjectId,
      ref: "MedicalOrder",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
export const MedicalRecord: IMedicalRecordModel = model<
  IMedicalRecord,
  IMedicalRecordModel
>("MedicalRecord", schema);
