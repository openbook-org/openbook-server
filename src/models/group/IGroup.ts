import { ObjectId } from "mongodb";
import { Types, Model } from "mongoose";

export interface ISimplifiedBalance {
  from: Types.ObjectId;
  to: Types.ObjectId;
  amount: number;
}

export interface IGroup {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  members: ObjectId[];
  balances: ISimplifiedBalance[];
  simpilifyBalance: Boolean;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGroupModel extends Model<IGroup> {}
