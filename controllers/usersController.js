import * as usersService from "../services/usersServices.js";
import waterNotesServices from "../services/waterNotesServices.js";
import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const currentUser = async (req, res) => {
  const { email, name, token, gender, waterRate, avatarURL } = req.user;

  res.json({
    token,
    user: {
      email,
      name,
      gender,
      waterRate,
      avatarURL,
    },
  });
};

const updateAvatar = async (req, res) => {
  const avatarURL = req.file.path;
  const { _id } = req.user;
  const result = await usersService.updateUserAvatar(_id, avatarURL);

  res.json({ avatarURL: result.avatarURL });
};

const updateUser = async (req, res) => {
  const { _id, password } = req.user;
  const { oldPassword, password: newPassword } = req.body;

  if (!oldPassword) {
    const result = await usersService.updateUserInfo(_id, req.body);
    const { email, name, gender, avatarURL, waterRate } = result;
    return res.json({ email, name, gender, avatarURL, waterRate });
  }

  const checkOldPassword = await usersService.isSamePassword(
    oldPassword,
    password
  );

  if (!checkOldPassword) {
    throw HttpError(
      400,
      "Sorry, the credentials you entered do not match your current password. Please verify the accuracy of the entered information and try again."
    );
  }

  const updatePassword = await usersService.hashNewPassword(newPassword);

  const result = await usersService.updateUserInfo(_id, {
    ...req.body,
    password: updatePassword,
  });

  const { email, name, gender, avatarURL, waterRate } = result;

  return res.json({
    email,
    name,
    gender,
    avatarURL,
    waterRate,
  });
};

const updateWaterRate = async (req, res) => {
  const { _id } = req.user;

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();

  const currentDate = `${dd}-${mm}-${yyyy}`;

  const result = await usersService.updateWaterRate(_id, req.body);

  res.json({ waterRate: result.waterRate });
};

export default {
  currentUser: ctrlWrapper(currentUser),
  updateAvatar: ctrlWrapper(updateAvatar),
  updateUser: ctrlWrapper(updateUser),
  updateWaterRate: ctrlWrapper(updateWaterRate),
};
