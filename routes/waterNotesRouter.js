import express from "express";
import validateBody from "../helpers/validateBody.js";
import waterNotesControllers from "../controllers/waterNotesControllers.js";
import {
  waterNoteJoiSchema,
  deleteDoseWaterJoiSchema,
  getDataTodayJoiSchema,
} from "../schemas/waterNoteSchema.js";
import { authenticate } from "../middleware/authenticate.js";
import isValidId from "../helpers/isValidId.js";
import waterNotesServices from "../services/waterNotesServices.js";

const waterNotesRouter = express.Router();

waterNotesRouter.use(authenticate);

waterNotesRouter.post(
  "/",
  validateBody(waterNoteJoiSchema),
  waterNotesControllers.createWaterNote
);

waterNotesRouter.patch(
  "/update-dose-water/:id",
  isValidId,
  validateBody(waterNoteJoiSchema),
  waterNotesControllers.updateDoseWater
);

waterNotesRouter.delete(
  "/delete-dose-water/:id",
  isValidId,
  validateBody(deleteDoseWaterJoiSchema),
  waterNotesControllers.deleteDoseWater
);

waterNotesRouter.get(
  "/today",
  validateBody(getDataTodayJoiSchema),
  waterNotesControllers.today
);

waterNotesRouter.get("/month", waterNotesControllers.month);

export default waterNotesRouter;
