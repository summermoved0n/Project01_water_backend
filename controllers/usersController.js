import * as usersService from "../services/usersServices.js";
import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const currentUser = async (req, res) => {
  // console.log(req.user);
  const { email } = req.user;

  res.json({
    email,
  });
};

const updateAvatar = async (req, res) => {};

const updateUser = async (req, res) => {};

const updateWaterRate = async (req, res) => {};

export default {
  currentUser: ctrlWrapper(currentUser),
  updateAvatar: ctrlWrapper(updateAvatar),
  updateUser: ctrlWrapper(updateUser),
  updateWaterRate: ctrlWrapper(updateWaterRate),
};
