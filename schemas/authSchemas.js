import Joi from "joi";
//import { PASSWD_REGEX } from '../constants/regexValues.js';
import { PASSWD_REGEX } from "../constants/regexValues.js";

export const signupSchema = Joi.object({
  email: Joi.string().email().required().empty(false).messages({
    "string.base": "The email must be a string",
    "any.required": "The email field is required",
    "string.empty": "The email must not be empty",
    "string.email": "The email must be in format user@example.com",
  }),
  password: Joi.string().regex(PASSWD_REGEX).required().empty(false).messages({
    "string.base": "The password must be a string",
    "any.required": "The password field is required",
    "string.empty": "The password must not be empty",
    "string.min": "The password must be not less 8 symbols",
    "string.max": "The password must be not more 64 symbols",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().empty(false).messages({
    "string.base": "The email must be a string",
    "any.required": "The email field is required",
    "string.empty": "The email must not be empty",
    "email.base": "The email must be in format user@example.com",
  }),
  password: Joi.string().required().empty(false).messages({
    "string.base": "The password must be a string",
    "any.required": "The password field is required",
    "string.empty": "The password must not be empty",
  }),
});

export const resendEmail = Joi.object({
  email: Joi.string().email().required().empty(false).messages({
    "string.base": "The email must be a string",
    "any.required": "The email field is required",
    "string.empty": "The email must not be empty",
    "string.email": "The email must be in format user@example.com",
  }),
});
