import validateBody from "../helpers/validateBody.js";
import isValidId from "../helpers/isValidId.js";
import { loginSchema } from "../schemas/authSchemas.js";
import express from "express";
import { signupSchema } from "../schemas/authSchemas.js";
import { signup, login, logout } from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";

const userRouter = express.Router();
userRouter.post("/signup", validateBody(signupSchema), signup);
userRouter.post("/signin", validateBody(loginSchema), login);
userRouter.post("/logout", authenticate, logout);

export default userRouter;
