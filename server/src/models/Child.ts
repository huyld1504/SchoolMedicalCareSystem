import { Document, Model, Schema, Types, model } from "mongoose";

export interface IChild extends Document {
  name: string;
  birthdate: Date;
  studentCode: string;
  gender: string;
  medicalConverageId: string;
  isActive: boolean;
  userId: Types.ObjectId;
}

interface IChildModel extends Model<IChild> {}

const schema = new Schema(
  {
    name: { type: String, required: true },
    birthdate: { type: Date, required: true },
    studentCode: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    medicalConverageId: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const Child: IChildModel = model<IChild, IChildModel>("Child", schema);
