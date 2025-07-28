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
            "string.hex": "ID chi tiết đơn thuốc phải là ObjectId hợp lệ",
            "string.length": "ID chi tiết đơn thuốc phải có độ dài 24 ký tự",
            "any.required": "ID chi tiết đơn thuốc là bắt buộc",
          }),
        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "Số lượng phải là một số",
          "number.integer": "Số lượng phải là số nguyên",
          "number.min": "Số lượng phải ít nhất là 1",
          "any.required": "Số lượng là bắt buộc",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Danh sách mục phải là một mảng",
      "array.min": "Ít nhất phải có một mục",
      "any.required": "Danh sách mục là bắt buộc",
    }),
});
