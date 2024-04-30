import validateBody from "../helpers/validateBody.js";
import isValidId from "../helpers/isValidId.js";
import {
  loginSchema,
  resendEmail,
  signupSchema,
} from "../schemas/authSchemas.js";
import express from "express";
import {
  signup,
  login,
  logout,
  verify,
  resendVerify,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";

const userRouter = express.Router();
userRouter.post("/signup", validateBody(signupSchema), signup);
userRouter.get("/verify/:verificationToken", verify);
userRouter.post("/verify", validateBody(resendEmail), resendVerify);
userRouter.post("/signin", validateBody(loginSchema), login);
userRouter.post("/logout", authenticate, logout);

export default userRouter;
