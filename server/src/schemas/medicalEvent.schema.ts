import Joi from "joi";

export const createMedicalEventSchema = Joi.object({
  type: Joi.string().required().messages({
    "string.base": "Loại sự kiện phải là một chuỗi ký tự",
    "any.required": "Loại sự kiện là bắt buộc"
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Mô tả phải là một chuỗi ký tự"
  }),
  dateHappened: Joi.date().required().messages({
    "date.base": "Ngày xảy ra phải là một ngày hợp lệ",
    "any.required": "Ngày xảy ra là bắt buộc"
  }),
  studentJoin: Joi.array().items(
    Joi.object({
      studentId: Joi.string().required().messages({
        "string.base": "ID học sinh phải là một chuỗi ký tự",
        "any.required": "ID học sinh là bắt buộc"
      }),
    })
  ).required().messages({
    "array.base": "Danh sách học sinh tham gia phải là một mảng",
    "any.required": "Danh sách học sinh tham gia là bắt buộc"
  }),
  note: Joi.string().optional().allow("").messages({
    "string.base": "Ghi chú phải là một chuỗi ký tự"
  }),
  solution: Joi.string().optional().allow("").messages({
    "string.base": "Giải pháp phải là một chuỗi ký tự"
  }),
  level: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Mức độ phải là một số",
    "number.integer": "Mức độ phải là số nguyên",
    "number.min": "Mức độ phải từ 1 đến 5",
    "number.max": "Mức độ phải từ 1 đến 5",
    "any.required": "Mức độ là bắt buộc"
  }),
  status: Joi.string().valid("Đã xử lí", "Chờ xử lí", "Đang xử lí").default("Chờ xử lí").messages({
    "string.base": "Trạng thái phải là một chuỗi ký tự",
    "any.only": "Trạng thái phải là 'Đã xử lí', 'Chờ xử lí' hoặc 'Đang xử lí'",
    "any.required": "Trạng thái là bắt buộc"
  }),
  imageURL: Joi.string().uri().optional().messages({
    "string.base": "URL hình ảnh phải là một chuỗi ký tự",
    "string.uri": "URL hình ảnh phải là một đường dẫn hợp lệ"
  })
});

export const updateMedicalEventSchema = Joi.object({
  type: Joi.string().optional().messages({
    "string.base": "Loại sự kiện phải là một chuỗi ký tự"
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Mô tả phải là một chuỗi ký tự"
  }),
  dateHappened: Joi.date().optional().messages({
    "date.base": "Ngày xảy ra phải là một ngày hợp lệ"
  }),
  studentJoin: Joi.array().items(
    Joi.object({
      studentId: Joi.string().required().messages({
        "string.base": "ID học sinh phải là một chuỗi ký tự",
        "any.required": "ID học sinh là bắt buộc"
      }),
    })
  ).optional().messages({
    "array.base": "Danh sách học sinh tham gia phải là một mảng"
  }),
  note: Joi.string().optional().allow("").messages({
    "string.base": "Ghi chú phải là một chuỗi ký tự"
  }),
  solution: Joi.string().optional().allow("").messages({
    "string.base": "Giải pháp phải là một chuỗi ký tự"
  }),
  level: Joi.number().integer().min(1).max(5).optional().messages({
    "number.base": "Mức độ phải là một số",
    "number.integer": "Mức độ phải là số nguyên",
    "number.min": "Mức độ phải từ 1 đến 5",
    "number.max": "Mức độ phải từ 1 đến 5"
  }),
  status: Joi.string().valid("Đã xử lí", "Chờ xử lí", "Đang xử lí").optional().messages({
    "string.base": "Trạng thái phải là một chuỗi ký tự",
    "any.only": "Trạng thái phải là 'Đã xử lí', 'Chờ xử lí' hoặc 'Đang xử lí'"
  }),
  imageURL: Joi.string().uri().optional().messages({
    "string.base": "URL hình ảnh phải là một chuỗi ký tự",
    "string.uri": "URL hình ảnh phải là một đường dẫn hợp lệ"
  }).allow("").default("")
});