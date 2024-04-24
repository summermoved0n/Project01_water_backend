import { HttpError } from "../helpers/HttpError.js";
import User from "../models/usersModel.js";
import { createUser, emailUnique } from "../services/authServices.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import gravatar from "gravatar";

const { SECRET_KEY } = process.env;

export const signup = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await emailUnique(email);
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const avatar = gravatar.url(email);

    const newUser = await createUser(req.body, avatar);
    const { _id, name, gender, token, waterRate, avatarURL } = newUser;

    res.status(201).json({
      token,
      user: {
        _id,
        email: newUser.email,
        name,
        gender,
        waterRate,
        avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    //find user
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isPasswordChecked = await bcrypt.compare(password, user.password);

    if (!isPasswordChecked) {
      throw HttpError(401, "Email or password is wrong");
    }
    //create token
    const payload = {
      id: user._id,
    };
    const tokenIssue = jwt.sign(payload, SECRET_KEY);
    await User.findByIdAndUpdate(user._id, { token: tokenIssue });

    res.json({
      token: tokenIssue,
      user: {
        email: user.email,
        name: user.name,
        gender: user.gender,
        waterRate: user.waterRate,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: null });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
