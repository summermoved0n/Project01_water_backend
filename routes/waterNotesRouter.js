import express from "express";
import validateBody from "../helpers/validateBody.js";
import waterNotesControllers from "../controllers/waterNotesControllers.js";
import { waterNoteJoiSchema } from "../schemas/waterNoteSchema.js";
import { authenticate } from "../middleware/authenticate.js";
import isValidId from "../helpers/isValidId.js";

const waterNotesRouter = express.Router();

waterNotesRouter.use(authenticate);

waterNotesRouter.post(
  "/",
  validateBody(waterNoteJoiSchema),
  waterNotesControllers.createWaterNote
);

export default waterNotesRouter;
