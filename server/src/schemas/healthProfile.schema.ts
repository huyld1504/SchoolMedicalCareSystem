import Joi from "joi";

export const addHealthProfileSchema = Joi.object({
  studentId: Joi.string().required().messages({
    "string.base": "ID học sinh phải là một chuỗi ký tự",
    "any.required": "ID học sinh là bắt buộc"
  }), //child ID
  height: Joi.number().min(30).max(250).required().messages({
    "number.base": "Chiều cao phải là một số",
    "number.min": "Chiều cao phải ít nhất 30cm",
    "number.max": "Chiều cao không được vượt quá 250cm",
    "any.required": "Chiều cao là bắt buộc"
  }),
  weight: Joi.number().min(1).max(300).required().messages({
    "number.base": "Cân nặng phải là một số",
    "number.min": "Cân nặng phải ít nhất 1kg",
    "number.max": "Cân nặng không được vượt quá 300kg",
    "any.required": "Cân nặng là bắt buộc"
  }),
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
    .required().messages({
      "string.base": "Nhóm máu phải là một chuỗi ký tự",
      "any.only": "Nhóm máu phải là một trong các giá trị: A, B, AB, O, A+, A-, B+, B-, AB+, AB-, O+, O-",
      "any.required": "Nhóm máu là bắt buộc"
    }),
  vision: Joi.string().max(50).required().messages({
    "string.base": "Thị lực phải là một chuỗi ký tự",
    "string.max": "Thị lực không được vượt quá 50 ký tự",
    "any.required": "Thị lực là bắt buộc"
  }),
  allergies: Joi.string().allow("").max(200).required().messages({
    "string.base": "Dị ứng phải là một chuỗi ký tự",
    "string.max": "Dị ứng không được vượt quá 200 ký tự"
  }),
  chronicDiseases: Joi.string().allow("").max(200).required().messages({
    "string.base": "Bệnh mãn tính phải là một chuỗi ký tự",
    "string.max": "Bệnh mãn tính không được vượt quá 200 ký tự"
  }),
  devicesSupport: Joi.string().allow("").max(200).required().messages({
    "string.base": "Thiết bị hỗ trợ phải là một chuỗi ký tự",
    "string.max": "Thiết bị hỗ trợ không được vượt quá 200 ký tự"
  }),
});

export const updateHealthProfileSchema = Joi.object({
  height: Joi.number().min(30).max(250).messages({
    "number.base": "Chiều cao phải là một số",
    "number.min": "Chiều cao phải ít nhất 30cm",
    "number.max": "Chiều cao không được vượt quá 250cm"
  }),
  weight: Joi.number().min(1).max(300).messages({
    "number.base": "Cân nặng phải là một số",
    "number.min": "Cân nặng phải ít nhất 1kg",
    "number.max": "Cân nặng không được vượt quá 300kg"
  }),
  bloodType: Joi.string().valid(
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
  ).messages({
    "string.base": "Nhóm máu phải là một chuỗi ký tự",
    "any.only": "Nhóm máu phải là một trong các giá trị: A, B, AB, O, A+, A-, B+, B-, AB+, AB-, O+, O-"
  }),
  vision: Joi.string().max(50).messages({
    "string.base": "Thị lực phải là một chuỗi ký tự",
    "string.max": "Thị lực không được vượt quá 50 ký tự"
  }),
  allergies: Joi.string().allow("").max(200).messages({
    "string.base": "Dị ứng phải là một chuỗi ký tự",
    "string.max": "Dị ứng không được vượt quá 200 ký tự"
  }),
  chronicDiseases: Joi.string().allow("").max(200).messages({
    "string.base": "Bệnh mãn tính phải là một chuỗi ký tự",
    "string.max": "Bệnh mãn tính không được vượt quá 200 ký tự"
  }),
  devicesSupport: Joi.string().allow("").max(200).messages({
    "string.base": "Thiết bị hỗ trợ phải là một chuỗi ký tự",
    "string.max": "Thiết bị hỗ trợ không được vượt quá 200 ký tự"
  }),
});
