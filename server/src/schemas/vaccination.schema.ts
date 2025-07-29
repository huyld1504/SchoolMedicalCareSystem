import Joi from 'joi';

// Schema cho tạo chiến dịch tiêm chủng
export const createCampaignSchema = Joi.object({
  vaccineName: Joi.string().min(2).max(100).required().messages({
    "string.base": "Tên vaccine phải là một chuỗi ký tự",
    "string.min": "Tên vaccine phải có ít nhất 2 ký tự",
    "string.max": "Tên vaccine không được vượt quá 100 ký tự",
    "any.required": "Tên vaccine là bắt buộc"
  }),
  vaccineType: Joi.string().min(2).max(100).required().messages({
    "string.base": "Loại vaccine phải là một chuỗi ký tự",
    "string.min": "Loại vaccine phải có ít nhất 2 ký tự",
    "string.max": "Loại vaccine không được vượt quá 100 ký tự",
    "any.required": "Loại vaccine là bắt buộc"
  }),
  vaccineDescription: Joi.string().min(10).max(500).optional().required().messages({
    "string.base": "Mô tả vaccine phải là một chuỗi ký tự",
    "string.min": "Mô tả vaccine phải có ít nhất 10 ký tự",
    "string.max": "Mô tả vaccine không được vượt quá 500 ký tự",
    "any.required": "Mô tả vaccine là bắt buộc"
  }),
  dosage: Joi.number().positive().optional().required().messages({
    "number.base": "Liều lượng phải là một số",
    "number.positive": "Liều lượng phải là số dương",
    "any.required": "Liều lượng là bắt buộc"
  }),
  injection: Joi.number().positive().required().required().messages({
    "number.base": "Số mũi tiêm phải là một số",
    "number.positive": "Số mũi tiêm phải là số dương",
    "any.required": "Số mũi tiêm là bắt buộc"
  }),
  targetAudience: Joi.string().min(5).max(200).required().messages({
    "string.base": "Đối tượng mục tiêu phải là một chuỗi ký tự",
    "string.min": "Đối tượng mục tiêu phải có ít nhất 5 ký tự",
    "string.max": "Đối tượng mục tiêu không được vượt quá 200 ký tự",
    "any.required": "Đối tượng mục tiêu là bắt buộc"
  }),
  startDate: Joi.date().iso().custom((value, helpers) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    const inputDate = new Date(value);
    
    if (inputDate < today) {
      return helpers.error('date.min');
    }
    return value;
  }).required().messages({
    "date.base": "Ngày bắt đầu phải là một ngày hợp lệ",
    "date.iso": "Ngày bắt đầu phải theo định dạng ISO",
    "date.min": "Ngày bắt đầu phải từ hôm nay trở đi",
    "any.required": "Ngày bắt đầu là bắt buộc"
  }),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required().messages({
    "date.base": "Ngày kết thúc phải là một ngày hợp lệ",
    "date.iso": "Ngày kết thúc phải theo định dạng ISO",
    "date.min": "Ngày kết thúc phải sau ngày bắt đầu",
    "any.required": "Ngày kết thúc là bắt buộc"
  }),
});

// Schema cho cập nhật chiến dịch tiêm chủng
export const updateCampaignSchema = Joi.object({
  vaccineName: Joi.string().min(2).max(100).optional().messages({
    "string.base": "Tên vaccine phải là một chuỗi ký tự",
    "string.min": "Tên vaccine phải có ít nhất 2 ký tự",
    "string.max": "Tên vaccine không được vượt quá 100 ký tự"
  }),
  vaccineType: Joi.string().min(2).max(100).optional().messages({
    "string.base": "Loại vaccine phải là một chuỗi ký tự",
    "string.min": "Loại vaccine phải có ít nhất 2 ký tự",
    "string.max": "Loại vaccine không được vượt quá 100 ký tự"
  }),
  vaccineDescription: Joi.string().min(10).max(500).optional().messages({
    "string.base": "Mô tả vaccine phải là một chuỗi ký tự",
    "string.min": "Mô tả vaccine phải có ít nhất 10 ký tự",
    "string.max": "Mô tả vaccine không được vượt quá 500 ký tự"
  }),
  dosage: Joi.number().positive().optional().messages({
    "number.base": "Liều lượng phải là một số",
    "number.positive": "Liều lượng phải là số dương"
  }),
  injection: Joi.number().positive().optional().messages({
    "number.base": "Số mũi tiêm phải là một số",
    "number.positive": "Số mũi tiêm phải là số dương"
  }),
  targetAudience: Joi.string().min(5).max(200).optional().messages({
    "string.base": "Đối tượng mục tiêu phải là một chuỗi ký tự",
    "string.min": "Đối tượng mục tiêu phải có ít nhất 5 ký tự",
    "string.max": "Đối tượng mục tiêu không được vượt quá 200 ký tự"
  }),
  startDate: Joi.date().iso().optional().messages({
    "date.base": "Ngày bắt đầu phải là một ngày hợp lệ",
    "date.iso": "Ngày bắt đầu phải theo định dạng ISO"
  }),
  endDate: Joi.date().iso().when('startDate', {
    is: Joi.exist(),
    then: Joi.date().iso().min(Joi.ref('startDate')).messages({
      "date.min": "Ngày kết thúc phải sau ngày bắt đầu"
    }),
    otherwise: Joi.date().iso().optional().messages({
      "date.base": "Ngày kết thúc phải là một ngày hợp lệ",
      "date.iso": "Ngày kết thúc phải theo định dạng ISO"
    }),
  }),
  status: Joi.string()
    .valid('planned', 'ongoing', 'completed', 'canceled')
    .optional().messages({
      "string.base": "Trạng thái phải là một chuỗi ký tự",
      "any.only": "Trạng thái phải là 'planned', 'ongoing', 'completed' hoặc 'canceled'"
    }),
});

// Schema cho thêm học sinh vào chiến dịch
export const addStudentsToCampaignSchema = Joi.object({
  studentIds: Joi.array().items(Joi.string().required()).min(1).required().messages({
    "array.base": "Danh sách ID học sinh phải là một mảng",
    "array.min": "Phải có ít nhất một ID học sinh",
    "any.required": "Danh sách ID học sinh là bắt buộc",
    "string.base": "ID học sinh phải là một chuỗi ký tự"
  }),
});

// Schema cho phụ huynh đồng ý/từ chối với business rules validation
export const parentConsentSchema = Joi.object({
  consent: Joi.string().valid('approved', 'denied', 'canceled').required().messages({
    "string.base": "Sự đồng ý phải là một chuỗi ký tự",
    "any.only": "Sự đồng ý phải là 'approved', 'denied' hoặc 'canceled'",
    "any.required": "Sự đồng ý là bắt buộc"
  }),
  note: Joi.string().max(500).allow('').optional().messages({
    "string.base": "Ghi chú phải là một chuỗi ký tự",
    "string.max": "Ghi chú không được vượt quá 500 ký tự"
  }), // Cho phép empty string
});

// Schema cho y tá ghi nhận kết quả tiêm với business rules
export const nurseRecordSchema = Joi.object({
  status: Joi.string()
    .valid('completed', 'missed', 'canceled')
    .required().messages({
      "string.base": "Trạng thái phải là một chuỗi ký tự",
      "any.only": "Trạng thái phải là 'completed', 'missed' hoặc 'canceled'",
      "any.required": "Trạng thái là bắt buộc"
    }),
  vaccinationDate: Joi.date()
    .when('status', {
      is: 'completed',
      then: Joi.required().messages({
        'any.required': 'Ngày tiêm là bắt buộc khi trạng thái là hoàn thành',
      }),
      otherwise: Joi.optional(),
    }).messages({
      "date.base": "Ngày tiêm phải là một ngày hợp lệ"
    }),
  note: Joi.string().max(500).allow('').optional().messages({
    "string.base": "Ghi chú phải là một chuỗi ký tự",
    "string.max": "Ghi chú không được vượt quá 500 ký tự"
  }), // Cho phép empty string
});

// Schema cho query parameters của vaccination campaigns
export const campaignQuerySchema = Joi.object({
  // Pagination
  page: Joi.number().integer().min(1).default(1).allow('').empty(''),
  paging: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .allow('')
    .empty(''),
  limit: Joi.number().integer().min(1).max(100).default(10).allow('').empty(''),

  // Filters
  status: Joi.string()
    .valid('planned', 'ongoing', 'completed', 'canceled')
    .allow('')
    .optional(),
  // Sort
  sort: Joi.string()
    .pattern(/^[a-zA-Z]+:(asc|desc)$/)
    .default('startDate:desc'),

  // Search
  keyword: Joi.string().max(100).allow('').optional().messages({
    'string.max': 'Từ khóa không được dài hơn 100 ký tự',
    "string.base": "Từ khóa phải là một chuỗi ký tự"
  }),
  // Date range filters
  startDateFrom: Joi.date().iso().allow('').optional(),
  startDateTo: Joi.date().iso().allow('').optional(),
  endDateFrom: Joi.date().iso().allow('').optional(),
  endDateTo: Joi.date().iso().allow('').optional(),
  // Legacy support
  sortBy: Joi.string()
    .valid('startDate', 'endDate', 'createdAt', 'status')
    .allow('')
    .optional(),
  sortOrder: Joi.string().valid('asc', 'desc').allow('').optional(),
});

// Schema cho query parameters của vaccination participations
export const participationQuerySchema = Joi.object({
  // Pagination
  page: Joi.number().integer().min(1).default(1).allow('').empty(''),
  paging: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .allow('')
    .empty(''),
  limit: Joi.number().integer().min(1).max(100).default(10).allow('').empty(''),

  // Filters
  parentConsent: Joi.string()
    .valid('pending', 'approved', 'denied')
    .allow('')
    .optional(),
  vaccinationStatus: Joi.string()
    .valid('scheduled', 'completed', 'missed', 'canceled')
    .allow('')
    .optional(),
  campaignId: Joi.string().allow('').optional(),
  studentId: Joi.string().allow('').optional(),

  // Sort
  sort: Joi.string()
    .pattern(/^[a-zA-Z]+:(asc|desc)$/)
    .default('createdAt:desc'),

  // Search
  keyword: Joi.string().max(100).allow('').optional().messages({
    'string.max': 'Từ khóa không được dài hơn 100 ký tự',
    "string.base": "Từ khóa phải là một chuỗi ký tự"
  }),

  // Date range filters
  consentDateFrom: Joi.date().iso().allow('').optional(),
  consentDateTo: Joi.date().iso().allow('').optional(),
  vaccinationDateFrom: Joi.date().iso().allow('').optional(),
  vaccinationDateTo: Joi.date().iso().allow('').optional(),

  // Legacy support
  sortBy: Joi.string()
    .valid('createdAt', 'parentConsentDate', 'vaccinationDate')
    .allow('')
    .optional(),
  sortOrder: Joi.string().valid('asc', 'desc').allow('').optional(),
});
