import * as usersService from "../services/usersServices.js";
import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const currentUser = async (req, res) => {
  // console.log(req.user);
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

  res.json(result);
};

const updateUser = async (req, res) => {
  const { _id, password } = req.user;
  // console.log(req.user);
  console.log(req.body);
  const { oldPassword, password: newPassword } = req.body;

  if (!oldPassword) {
    const result = await usersService.updateUserInfo(_id, req.body);
    res.json(result);
  }

  const checkOldPassword = await usersService.isSamePassword(
    oldPassword,
    password
  );

  console.log(checkOldPassword);

  if (!checkOldPassword) {
    throw HttpError(
      404,
      "Sorry, the credentials you entered do not match your current password. Please verify the accuracy of the entered information and try again."
    );
  }

  const updatePassword = await usersService.hashNewPassword(newPassword);
  console.log(updatePassword);

  const result = await usersService.updateUserInfo(_id, {
    ...req.body,
    updatePassword,
  });

  console.log("leave from func");

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
