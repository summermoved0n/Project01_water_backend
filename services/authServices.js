import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/usersModel.js";
import bcrypt from "bcrypt";
dotenv.config();

const { SECRET_KEY } = process.env;

export const emailUnique = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

export const createUser = async (userData, avatar, verificationToken) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const user = await User.create({
    ...userData,
    avatarURL: avatar,
    verificationToken,
    password: hashedPassword,
  });

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY);
  const newUser = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );
  return newUser;
};
