import fs from "fs/promises";
import Jimp from "jimp";
import path from "path";

import * as usersService from "../services/usersServices.js";
// import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const avatarsPath = path.resolve("public", "avatars");

const currentUser = async (req, res) => {
  // console.log(req.user);
  const { email, name, token, gender, waterRate } = req.user;

  res.json({
    token,
    user: {
      email,
      name,
      gender,
      waterRate,
    },
  });
};

const updateAvatar = async (req, res) => {
  const avatarURL = req.file.path;
  console.log(avatarURL);
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const newAvatar = path.join("public", "avatars", filename);

  Jimp.read(newAvatar)
    .then((avatar) => {
      return avatar.resize(28, 28).write(newAvatar);
    })
    .catch((err) => {
      console.error(err);
    });

  const result = await usersService.updateUserAvatar(_id, {
    avatarURL: newAvatar,
  });

  res.json(result);
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  const result = await usersService.updateUserInfo(_id, req.body);

  res.json(result);
};

const updateWaterRate = async (req, res) => {
  const { _id } = req.user;
  const result = await usersService.updateWaterRate(_id, req.body);

  res.json(result);
};

export default {
  currentUser: ctrlWrapper(currentUser),
  updateAvatar: ctrlWrapper(updateAvatar),
  updateUser: ctrlWrapper(updateUser),
  updateWaterRate: ctrlWrapper(updateWaterRate),
};
