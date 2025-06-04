import { Document, Model, Schema, model } from "mongoose";

export interface IRole extends Document {
  /** Role name */
  name: string;
}

interface IRoleModel extends Model<IRole> {}

const schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" },
  }
);

export const Role: IRoleModel = model<IRole, IRoleModel>("Role", schema);
