import { Types, Model } from "mongoose";

export enum SplitType {
  EQUAL = "EQUAL",
  UNEQUAL = "UNEQUAL",
  PERCENTAGE = "PERCENTAGE",
}

export interface IExpense {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  amount: number;
  payers: {
    userId: Types.ObjectId;
    amount: number;
  }[];
  participants: Types.ObjectId[];
  groupId?: Types.ObjectId;
  splitType: SplitType;
  splits: {
    userId: Types.ObjectId;
    amount: number;
  }[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExpenseModel extends Model<IExpense> {}
