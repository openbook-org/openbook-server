import { Schema, model } from "mongoose";
import { IExpense, IExpenseModel, SplitType } from "./IExpense";
import { MongoCollection } from "../../shared/constant/database";

const expenseSchema = new Schema<IExpense, IExpenseModel>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  payers: {
    type: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: MongoCollection.USER,
        },
        amount: {
          type: Number,
        },
      },
    ],
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: MongoCollection.USER,
    },
  ],
  groupId: {
    type: Schema.Types.ObjectId,
    ref: MongoCollection.GROUP,
  },
  splitType: {
    type: String,
    enum: Object.values(SplitType),
    required: true,
  },
  splits: {
    type: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: MongoCollection.USER,
        },
        amount: {
          type: Number,
        },
      },
    ],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: MongoCollection.USER,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Expense = model<IExpense, IExpenseModel>(
  MongoCollection.EXPENSE,
  expenseSchema
);

export default Expense;
