import { Document, Model, Schema, Types, model } from "mongoose";
import { IChild } from "./Child";

export interface IMedicalOrder extends Document {
  ChildId: Types.ObjectId | IChild;
  startDate: Date;
  endDate: Date;
  note: string;
  status: string;
  isStock: boolean;
}

interface IMedicalOrderModel extends Model<IMedicalOrder> {}
const schema = new Schema(
  {
    ChildId: { type: Types.ObjectId, ref: "Child", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    note: { type: String },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "canceled", "completed"],
      default: "pending",
    },
    isStock: { type: Boolean, default: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
export const MedicalOrder: IMedicalOrderModel = model<
  IMedicalOrder,
  IMedicalOrderModel
>("MedicalOrder", schema);
