import validateBody from '../helpers/validateBody.js';
import isValidId from '../helpers/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from '../schemas/contactsSchemas.js';
import { loginSchema } from '../schemas/userSchemas.js';
import express from 'express';
import { signupSchema } from '../schemas/userSchemas.js';
import { register, login, logout, current } from '../controllers/auth.js';
import { authenticate } from '../middleware/authenticate.js';

const userRouter = express.Router();
userRouter.post('/register', validateBody(signupSchema), register);
userRouter.post('/login', validateBody(loginSchema), login);

userRouter.post('/logout', authenticate, logout);
userRouter.get('/current', authenticate, current);

export default userRouter;
