import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email phải là một chuỗi ký tự",
    "string.email": "Email không đúng định dạng",
    "any.required": "Email là bắt buộc"
  }),
  password: Joi.string().min(6).max(20).required().messages({
    "string.base": "Mật khẩu phải là một chuỗi ký tự",
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
    "string.max": "Mật khẩu không được vượt quá 20 ký tự",
    "any.required": "Mật khẩu là bắt buộc"
  }),
});

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(30).required().messages({
    "string.base": "Tên phải là một chuỗi ký tự",
    "string.min": "Tên phải có ít nhất 2 ký tự",
    "string.max": "Tên không được vượt quá 30 ký tự",
    "any.required": "Tên là bắt buộc"
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email phải là một chuỗi ký tự",
    "string.email": "Email không đúng định dạng",
    "any.required": "Email là bắt buộc"
  }),
  password: Joi.string().min(6).max(20).required().messages({
    "string.base": "Mật khẩu phải là một chuỗi ký tự",
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
    "string.max": "Mật khẩu không được vượt quá 20 ký tự",
    "any.required": "Mật khẩu là bắt buộc"
  }),
});

export const addUserSchema = Joi.object({
  name: Joi.string().min(2).max(30).required().messages({
    "string.base": "Tên phải là một chuỗi ký tự",
    "string.min": "Tên phải có ít nhất 2 ký tự",
    "string.max": "Tên không được vượt quá 30 ký tự",
    "any.required": "Tên là bắt buộc"
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email phải là một chuỗi ký tự",
    "string.email": "Email không đúng định dạng",
    "any.required": "Email là bắt buộc"
  }),
  password: Joi.string().min(6).max(20).required().messages({
    "string.base": "Mật khẩu phải là một chuỗi ký tự",
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
    "string.max": "Mật khẩu không được vượt quá 20 ký tự",
    "any.required": "Mật khẩu là bắt buộc"
  }),
  roleId: Joi.string().required().messages({
    "string.base": "ID vai trò phải là một chuỗi ký tự",
    "any.required": "ID vai trò là bắt buộc"
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{9,11}$/)
    .required().messages({
      "string.base": "Số điện thoại phải là một chuỗi ký tự",
      "string.pattern.base": "Số điện thoại phải có từ 9-11 chữ số",
      "any.required": "Số điện thoại là bắt buộc"
    })
});

export const addChildSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "Tên phải là một chuỗi ký tự",
    "string.min": "Tên phải có ít nhất 2 ký tự",
    "string.max": "Tên không được vượt quá 50 ký tự",
    "any.required": "Tên là bắt buộc"
  }),
  birthdate: Joi.date().iso().required().messages({
    "date.base": "Ngày sinh phải là một ngày hợp lệ",
    "date.iso": "Ngày sinh phải theo định dạng ISO 8601",
    "any.required": "Ngày sinh là bắt buộc"
  }),
  studentCode: Joi.string().required().messages({
    "string.base": "Mã học sinh phải là một chuỗi ký tự",
    "any.required": "Mã học sinh là bắt buộc"
  }),
  gender: Joi.string().valid("male", "female", "other").required().messages({
    "string.base": "Giới tính phải là một chuỗi ký tự",
    "any.only": "Giới tính phải là 'male', 'female' hoặc 'other'",
    "any.required": "Giới tính là bắt buộc"
  }),
  medicalConverageId: Joi.string().required().messages({
    "string.base": "Mã bảo hiểm y tế phải là một chuỗi ký tự",
    "any.required": "Mã bảo hiểm y tế là bắt buộc"
  }),

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
