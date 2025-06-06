import Joi from "@hapi/joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

export const addUserSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  roleId: Joi.string().required(),
});

export const addChildSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  birthdate: Joi.date().iso().required(), // ISO 8601 format string (e.g., "2020-01-01")
  studentCode: Joi.string().required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  medicalConverageId: Joi.string().required(),

  height: Joi.number().min(30).max(250).required(), // cm
  weight: Joi.number().min(1).max(300).required(), // kg
  bloodType: Joi.string()
    .valid(
      "A",
      "B",
      "AB",
      "O",
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-"
    )
    .required(),
  vision: Joi.string().max(50).required(),
  allergies: Joi.string().allow("").max(200).required(),
  chronicDiseases: Joi.string().allow("").max(200).required(),
  devicesSupport: Joi.string().allow("").max(200).required(),
});
