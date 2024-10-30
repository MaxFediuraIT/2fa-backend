import { Schema, model } from "mongoose";
import Joi from "joi";
import { createUser } from "./schema.js";

export const User = model("User", createUser(Schema));

export const joiRegisterUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const joiLoginUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const joiUpdateUserSecretSchema = Joi.object({
    secret: Joi.string().required(),
    id: Joi.string().required(),  
})