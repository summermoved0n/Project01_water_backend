import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/userModels.js';
import bcrypt from 'bcrypt';
dotenv.config();

const { SECRET_KEY } = process.env;

export const emailUnique = async email => {
  const user = await User.findOne({ email });
  return user;
};

export const createUser = async userData => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const user = await User.create({ ...userData, password: hashedPassword });

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY);
  console.log(token);
  const newUser = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );
  return newUser;
};
