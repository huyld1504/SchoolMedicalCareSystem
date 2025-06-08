import Joi from "joi";

export const medicalRecordSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        medicalOrderDetailId: Joi.string()
          .hex()
          .length(24)
          .required()
          .messages({
            "string.hex": "MedicalOrderDetailId must be a valid ObjectId",
            "string.length": "MedicalOrderDetailId must be 24 characters long",
            "any.required": "MedicalOrderDetailId is required",
          }),
        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a number",
          "number.integer": "Quantity must be an integer",
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Items must be an array",
      "array.min": "At least one item is required",
      "any.required": "Items are required",
    }),
});
