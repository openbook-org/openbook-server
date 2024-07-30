import { Schema, model } from "mongoose";
import {
  ITransaction,
  ITransactionModel,
  TransactionStatus,
} from "./ITransaction";
import { MongoCollection } from "../../shared/constant/database";

const transactionSchema = new Schema<ITransaction, ITransactionModel>({
  from: {
    type: Schema.Types.ObjectId,
    ref: MongoCollection.USER,
    required: true,
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: MongoCollection.USER,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: MongoCollection.GROUP,
  },
  status: {
    type: String,
    enum: Object.values(TransactionStatus),
    default: TransactionStatus.PENDING,
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

const Transaction = model<ITransaction, ITransactionModel>(
  MongoCollection.TRANSACTION,
  transactionSchema
);

export default Transaction;
