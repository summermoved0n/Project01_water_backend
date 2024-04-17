import { WaterNote } from "../models/waterNoteModel.js";

const createNewWaterNote = (data) => WaterNote.create({ ...data });

const getOneWaterNote = (filter) => WaterNote.findOne(filter);

const updateWaterRate = (filter, data) =>
  WaterNote.findOneAndUpdate(filter, data);

export default {
  createNewWaterNote,
  getOneWaterNote,
  updateWaterRate,
};
