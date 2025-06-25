import Joi from "joi";

// Schema cho tạo chiến dịch tiêm chủng
export const createCampaignSchema = Joi.object({
  vaccineName: Joi.string().min(2).max(100).required(),
  vaccineType: Joi.string().min(2).max(100).required(),
  targetAudience: Joi.string().min(5).max(200).required(),
  startDate: Joi.date().iso().min('now').required(),
});

// Schema cho cập nhật chiến dịch tiêm chủng
export const updateCampaignSchema = Joi.object({
  vaccineName: Joi.string().min(2).max(100).optional(),
  vaccineType: Joi.string().min(2).max(100).optional(),
  targetAudience: Joi.string().min(5).max(200).optional(),
  startDate: Joi.date().iso().optional(),
  status: Joi.string()
    .valid('planned', 'ongoing', 'completed', 'cancelled')
    .optional(),
});

// Schema cho thêm học sinh vào chiến dịch
export const addStudentsToCampaignSchema = Joi.object({
  studentIds: Joi.array().items(Joi.string().required()).min(1).required(),
});

// Schema cho phụ huynh đồng ý/từ chối
export const parentConsentSchema = Joi.object({
  consent: Joi.string().valid('approved', 'denied').required(),
  note: Joi.string().max(500).optional(),
});

// Schema cho y tá ghi nhận kết quả tiêm
export const nurseRecordSchema = Joi.object({
  status: Joi.string().valid('completed', 'missed', 'cancelled').required(),
  vaccinationDate: Joi.date().iso().when('status', {
    is: 'completed',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  note: Joi.string().max(500).optional(),
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
    .valid('planned', 'ongoing', 'completed', 'cancelled')
    .allow('')
    .optional(),
  
  // Sort
  sort: Joi.string()
    .pattern(/^[a-zA-Z]+:(asc|desc)$/)
    .default('startDate:desc'),
  
  // Search
  keyword: Joi.string().max(100).allow('').optional().messages({
    'string.max': 'Keyword cannot be longer than 100 characters',
  }),
  
  // Date range filters
  startDateFrom: Joi.date().iso().allow('').optional(),
  startDateTo: Joi.date().iso().allow('').optional(),
  
  // Legacy support
  sortBy: Joi.string()
    .valid('startDate', 'createdAt', 'status')
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
    .valid('scheduled', 'completed', 'missed', 'cancelled')
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
    'string.max': 'Keyword cannot be longer than 100 characters',
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
