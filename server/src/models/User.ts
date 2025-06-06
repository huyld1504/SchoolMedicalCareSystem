import { Document, Model, Schema, Types, model } from "mongoose";
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import { IRole } from "./Role";

export interface IUser extends Document {
  /** Email */
  email: string;
  /** Password */
  password: string;
  /** Password */
  name: string;
  encryptPassword: (password: string) => string;
  validPassword: (password: string) => boolean;

  /** Role id */
  roleId: Types.ObjectId | IRole;

  isActive: boolean;
}

interface IUserModel extends Model<IUser> {}

const schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    roleId: { type: Types.ObjectId, ref: "Role", required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

schema.methods.encryptPassword = (password: string) =>
  hashSync(password, genSaltSync(10));

schema.methods.validPassword = function (password: string) {
  return compareSync(password, this.password);
};

export const User: IUserModel = model<IUser, IUserModel>("User", schema);
