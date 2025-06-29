import { IUser } from "@src/models/User";
import { ObjectId } from "mongoose";

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}
export interface ILoginRequest {
  email: string;
  password: string;
}
export interface IAddUserRequest {
  name: string;
  email: string;
  password: string;
  roleId: ObjectId;
}
