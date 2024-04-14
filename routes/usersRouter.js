import express from "express";

import { authenticate } from "../middleware/authenticate.js";
import {
  userUpdateAvatar,
  userUpadateWaterRate,
  userUpdateInformation,
} from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
import usersController from "../controllers/usersController.js";
import upload from "../middleware/uploadAvatar.js";

const usersRouter = express.Router();

usersRouter.use(authenticate);

usersRouter.get("/current", usersController.currentUser);

usersRouter.patch(
  "/avatar",
  validateBody(userUpdateAvatar),
  upload.single("avatarURL"),
  usersController.updateAvatar
);

usersRouter.patch(
  "/",
  validateBody(userUpdateInformation),
  usersController.updateUser
);

usersRouter.patch(
  "/waterrate",
  validateBody(userUpadateWaterRate),
  usersController.updateWaterRate
);

export default usersRouter;
