import Joi from "joi";

export const userUpdateAvatar = Joi.object({
  avatarUrl: Joi.binary(),
});

export const userUpadateWaterRate = Joi.object({
  waterRate: Joi.string().min(1).max(15000).required(),
});

export const userUpdateInformation = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: true },
  }),
  name: Joi.string().min(3).max(32),
  password: Joi.string().min(8).max(64),
  oldPassword: Joi.string().min(8).max(64),
  gender: Joi.string().valid("male", "female"),
});
