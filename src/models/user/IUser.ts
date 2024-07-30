import { Types, Model } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends Model<IUser> {}
