import validateBody from '../helpers/validateBody.js';
import isValidId from '../helpers/isValidId.js';
import { loginSchema } from '../schemas/authSchemas.js';
import express from 'express';
import { signupSchema } from '../schemas/authSchemas.js';
import {
  signup,
  login,
  logout,
  current,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';

const userRouter = express.Router();
userRouter.post('/signup', validateBody(signupSchema), signup);
userRouter.post('/login', validateBody(loginSchema), login);

userRouter.post('/logout', authenticate, logout);
userRouter.get('/current', authenticate, current);

export default userRouter;
