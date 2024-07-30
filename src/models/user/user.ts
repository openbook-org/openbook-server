import { Schema, model } from "mongoose";
import { IUser, IUserModel } from "./IUser";
import { MongoCollection } from "../../shared/constant/database";

const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true
  },
  // subscription: {
  //   type: Schema.Types.ObjectId,
  //   ref: MongoCollection.SUBSCRIPTION,
  //   // required: true
  // },
  // customerId: {
  //   type: String,
  //   // required: true
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = model<IUser, IUserModel>(MongoCollection.USER, userSchema);

export default User;
