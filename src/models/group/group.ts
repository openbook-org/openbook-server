import { Schema, model } from "mongoose";
import { IGroup, IGroupModel, ISimplifiedBalance } from "./IGroup";
import { MongoCollection } from "../../shared/constant/database";

const groupSchema = new Schema<IGroup, IGroupModel>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: MongoCollection.USER,
    },
  ],
  balances: [
    {
      from: {
        type: Schema.Types.ObjectId,
        ref: MongoCollection.USER,
      },
      to: {
        type: Schema.Types.ObjectId,
        ref: MongoCollection.USER,
      },
      amount: {
        type: Number,
      },
    },
  ],
  simpilifyBalance: {
    type: Boolean,
    default: true,
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

const Group = model<IGroup, IGroupModel>(MongoCollection.GROUP, groupSchema);

export default Group;
