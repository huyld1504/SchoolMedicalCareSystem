import Joi from "@hapi/joi";

export const addHealthProfileSchema = Joi.object({
  studentId: Joi.string().required(), //child ID
  height: Joi.number().min(30).max(250).required(),
  weight: Joi.number().min(1).max(300).required(),
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
  UserId: Joi.string().required(), // User ID of the person creating the profile
});