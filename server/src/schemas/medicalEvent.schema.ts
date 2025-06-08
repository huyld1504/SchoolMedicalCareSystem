import Joi from "joi";

export const createMedicalEventSchema = Joi.object({
  type: Joi.string().required().messages({
    "string.base": "Event type must be a string.",
    "any.required": "Event type is required."
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Description must be a string."
  }),
  dateHappened: Joi.date().required().messages({
    "date.base": "Date must be a valid date.",
    "any.required": "Date is required."
  }),
  studentJoin: Joi.array().items(
    Joi.object({
      studentId: Joi.string().required().messages({
        "string.base": "Student ID must be a string.",
        "any.required": "Student ID is required."
      }),
    })
  ).required().messages({
    "array.base": "Student join must be an array.",
    "any.required": "Student join is required."
  }),
  note: Joi.string().optional().allow("").messages({
    "string.base": "Note must be a string."
  }),
  solution: Joi.string().optional().allow("").messages({
    "string.base": "Solution must be a string."
  }),
  level: Joi.number().integer().min(1).max(5).required()
})