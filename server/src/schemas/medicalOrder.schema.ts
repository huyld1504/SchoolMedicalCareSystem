import Joi from "joi";

export const medicalOrderSchema = Joi.object({
  ChildId: Joi.string().hex().length(24).required().messages({
    "string.hex": "ChildId must be a valid ObjectId",
    "string.length": "ChildId must be 24 characters long",
    "any.required": "ChildId is required",
  }),
  startDate: Joi.date().iso().required().messages({
    "date.base": "Start date must be a valid date",
    "date.iso": "Start date must be in ISO format",
    "any.required": "Start date is required",
  }),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required().messages({
    "date.base": "End date must be a valid date",
    "date.iso": "End date must be in ISO format",
    "date.greater": "End date must be after start date",
    "any.required": "End date is required",
  }),
  note: Joi.string().max(500).optional().messages({
    "string.base": "Note must be a string",
    "string.max": "Note must not exceed 500 characters",
  }),
});
export const medicalOrderDetailSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional().messages({
    "string.hex": "Medical order ID must be a valid ObjectId",
    "string.length": "Medical order ID must be 24 characters long",
  }),
  medicineName: Joi.string().required().messages({
    "string.base": "Medicine name must be a string",
    "any.required": "Medicine name is required",
  }),
  dosage: Joi.string().required().messages({
    "string.base": "Dosage must be a string",
    "any.required": "Dosage is required",
  }),
  type: Joi.string().required().messages({
    "string.base": "Type must be a string",
    "any.required": "Type is required",
  }),
  time: Joi.string().required().messages({
    "string.base": "Time must be a string",
    "any.required": "Time is required",
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),
  note: Joi.string().max(500).optional().messages({
    "string.base": "Note must be a string",
    "string.max": "Note must not exceed 500 characters",
  }),
});

export const createMedicalOrderWithDetailsSchema = Joi.object({
  medicalOrder: medicalOrderSchema.required(),
  medicalOrderDetails: Joi.array()
    .items(medicalOrderDetailSchema)
    .min(1)
    .required()
    .messages({
      "array.base": "Medical order details must be an array",
      "array.min": "At least one medical order detail is required",
      "any.required": "Medical order details are required",
    }),
});

export const additionalDetailsSchema = Joi.object({
  medicalOrderDetails: Joi.array()
    .items(medicalOrderDetailSchema)
    .min(1)
    .required()
    .messages({
      "array.base": "Details must be an array",
      "array.min": "At least one detail is required",
      "any.required": "Details are required",
    }),
});
