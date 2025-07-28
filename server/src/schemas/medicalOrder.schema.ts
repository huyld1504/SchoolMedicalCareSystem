import Joi from "joi";

export const medicalOrderSchema = Joi.object({
  ChildId: Joi.string().hex().length(24).required().messages({
    "string.hex": "ID trẻ em phải là ObjectId hợp lệ",
    "string.length": "ID trẻ em phải có độ dài 24 ký tự",
    "any.required": "ID trẻ em là bắt buộc",
  }),
  startDate: Joi.date().iso().required().messages({
    "date.base": "Ngày bắt đầu phải là một ngày hợp lệ",
    "date.iso": "Ngày bắt đầu phải theo định dạng ISO",
    "any.required": "Ngày bắt đầu là bắt buộc",
  }),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required().messages({
    "date.base": "Ngày kết thúc phải là một ngày hợp lệ",
    "date.iso": "Ngày kết thúc phải theo định dạng ISO",
    "date.greater": "Ngày kết thúc phải sau ngày bắt đầu",
    "any.required": "Ngày kết thúc là bắt buộc",
  }),
  note: Joi.string().max(500).optional().messages({
    "string.base": "Ghi chú phải là một chuỗi ký tự",
    "string.max": "Ghi chú không được vượt quá 500 ký tự",
  }),
  imageURL: Joi.string().uri().optional().messages({
    "string.base": "URL hình ảnh phải là một chuỗi ký tự",
    "string.uri": "URL hình ảnh phải là một đường dẫn hợp lệ",
  }).allow("").default(""),
});
export const medicalOrderDetailSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional().messages({
    "string.hex": "ID đơn thuốc phải là ObjectId hợp lệ",
    "string.length": "ID đơn thuốc phải có độ dài 24 ký tự",
  }),
  medicineName: Joi.string().required().messages({
    "string.base": "Tên thuốc phải là một chuỗi ký tự",
    "any.required": "Tên thuốc là bắt buộc",
  }),
  dosage: Joi.string().required().messages({
    "string.base": "Liều lượng phải là một chuỗi ký tự",
    "any.required": "Liều lượng là bắt buộc",
  }),
  type: Joi.string().required().messages({
    "string.base": "Loại thuốc phải là một chuỗi ký tự",
    "any.required": "Loại thuốc là bắt buộc",
  }),
  time: Joi.string().required().messages({
    "string.base": "Thời gian uống thuốc phải là một chuỗi ký tự",
    "any.required": "Thời gian uống thuốc là bắt buộc",
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Số lượng phải là một số",
    "number.integer": "Số lượng phải là số nguyên",
    "number.min": "Số lượng phải ít nhất là 1",
    "any.required": "Số lượng là bắt buộc",
  }),
  note: Joi.string().max(500).optional().messages({
    "string.base": "Ghi chú phải là một chuỗi ký tự",
    "string.max": "Ghi chú không được vượt quá 500 ký tự",
  }),
});

export const createMedicalOrderWithDetailsSchema = Joi.object({
  medicalOrder: medicalOrderSchema.required(),
  medicalOrderDetails: Joi.array()
    .items(medicalOrderDetailSchema)
    .min(0) // Allow empty array when user only uploads image
    .messages({
      "array.base": "Chi tiết đơn thuốc phải là một mảng",
      "any.required": "Chi tiết đơn thuốc là bắt buộc",
    }),
});

export const additionalDetailsSchema = Joi.object({
  medicalOrderDetails: Joi.array()
    .items(medicalOrderDetailSchema)
    .min(1)
    .required()
    .messages({
      "array.base": "Chi tiết phải là một mảng",
      "array.min": "Ít nhất phải có một chi tiết",
      "any.required": "Chi tiết là bắt buộc",
    }),
});
