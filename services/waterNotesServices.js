import { WaterNote } from "../models/waterNoteModel.js";

const createNewWaterNote = (data) => WaterNote.create({ ...data });

const getOneWaterNote = (filter) => WaterNote.findOne(filter);

export default {
  createNewWaterNote,
  getOneWaterNote,
};
