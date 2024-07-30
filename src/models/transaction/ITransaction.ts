import { ObjectId } from "mongodb";
import { Types, Model } from "mongoose";

export enum TransactionStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface ITransaction {
  _id: Types.ObjectId;
  from: ObjectId;
  to: ObjectId;
  amount: number;
  description?: string;
  groupId?: ObjectId;
  status: TransactionStatus;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionModel extends Model<ITransaction> {}
