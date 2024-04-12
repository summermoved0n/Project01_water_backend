import express from "express";

import { authenticate } from "../middleware/authenticate.js";
import {} from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
import usersController from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.use(authenticate);

usersRouter.get("/current", usersController.currentUser);

usersRouter.patch();

usersRouter.put();

export default usersRouter;
