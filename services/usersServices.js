import User from "../models/usersModel.js";

export const updateUserInfo = (id, data) =>
  User.findOneAndUpdate(id, data, {
    select: "email name gender waterRate avatarURL",
  });

export const updateWaterRate = (id, data) =>
  User.findOneAndUpdate(id, data, { select: "waterRate" });

export const updateUserAvatar = (id, data) =>
  User.findOneAndUpdate(id, data, { select: "avatarURL" });
