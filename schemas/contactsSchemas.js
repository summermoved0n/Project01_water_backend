import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phone: Joi.string().min(5).max(10).required(),
  email: Joi.string().email().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  phone: Joi.string().min(5).max(10),
  email: Joi.string().email(),
});

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
