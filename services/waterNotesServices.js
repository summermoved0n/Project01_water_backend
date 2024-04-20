import { WaterNote } from "../models/waterNoteModel.js";

const createNewWaterNote = (data) => WaterNote.create({ ...data });

const getOneWaterNote = (filter) => WaterNote.findOne(filter);

const updateWaterRate = (filter, data) =>
  WaterNote.findOneAndUpdate(filter, data);

const getOneAndUpdate = (filter, update, options) =>
  WaterNote.findOneAndUpdate(filter, update, options);

export default {
  createNewWaterNote,
  getOneWaterNote,
  updateWaterRate,
  getOneAndUpdate,
};
