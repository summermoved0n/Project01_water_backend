import { Schema, model } from "mongoose";

import { handeSaveError, setUpdateSettings } from "./hooksModel.js";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    name: {
      type: String,
      default: "User",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    waterRate: {
      type: Number,
      default: 2000,
    },
    avatarURL: String,
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handeSaveError);

userSchema.pre("findOneAndUpdate", setUpdateSettings);

userSchema.post("findOneAndUpdate", handeSaveError);

const User = model("user", userSchema);

export default User;
