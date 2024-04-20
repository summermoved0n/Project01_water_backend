import Joi from "joi";

export const waterNoteJoiSchema = Joi.object({
  waterVolume: Joi.number().min(1).max(5000).required(),
  date: Joi.string().required(),
});

export const deleteDoseWaterJoiSchema = Joi.object({
  date: Joi.string().required(),
});

export const getDataTodayJoiSchema = Joi.object({
  date: Joi.string().required(),
});
