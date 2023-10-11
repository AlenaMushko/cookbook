import { model, Schema } from "mongoose";

import { IUser } from "../types";

export enum EGenders {
  Male = "male",
  Female = "female",
}
const userSchema = new Schema(
  {
    name: {
      type: String,
      min: [3, "Name min 3 symbols"],
      max: [30, "Name max 20 symbols"],
    },
    age: {
      type: Number,
      min: [0, "Age min 0"],
      max: [120, "Age max 120"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    gender: {
      type: String,
      enum: EGenders,
    },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("user", userSchema);
