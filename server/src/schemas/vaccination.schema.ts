import Joi from "joi";

// Schema cho tạo chiến dịch tiêm chủng
export const createCampaignSchema = Joi.object({
  vaccineName: Joi.string().min(2).max(100).required(),
  vaccineType: Joi.string().min(2).max(100).required(),
  targetAudience: Joi.string().min(5).max(200).required(),
  startDate: Joi.date().iso().min('now').required()
});

// Schema cho cập nhật chiến dịch tiêm chủng
export const updateCampaignSchema = Joi.object({
  vaccineName: Joi.string().min(2).max(100).optional(),
  vaccineType: Joi.string().min(2).max(100).optional(),
  targetAudience: Joi.string().min(5).max(200).optional(),
  startDate: Joi.date().iso().optional(),
  status: Joi.string().valid('planned', 'ongoing', 'completed', 'cancelled').optional()
});

// Schema cho thêm học sinh vào chiến dịch
export const addStudentsToCampaignSchema = Joi.object({
  studentIds: Joi.array().items(Joi.string().required()).min(1).required()
});

// Schema cho phụ huynh đồng ý/từ chối
export const parentConsentSchema = Joi.object({
  consent: Joi.string().valid('approved', 'denied').required(),
  note: Joi.string().max(500).optional()
});

// Schema cho y tá ghi nhận kết quả tiêm
export const nurseRecordSchema = Joi.object({
  status: Joi.string().valid('completed', 'missed', 'cancelled').required(),
  vaccinationDate: Joi.date().iso().when('status', {
    is: 'completed',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  note: Joi.string().max(500).optional()
});

// Schema cho query parameters với keyword search tối ưu
export const campaignQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  paging: Joi.number().integer().min(1).max(100).default(10), // Dùng 'paging' thay vì 'limit' theo BaseQueryBuilder
  status: Joi.string().valid('planned', 'ongoing', 'completed', 'cancelled').optional(),
  sort: Joi.string().pattern(/^[a-zA-Z]+:(asc|desc)$/).default('startDate:desc'), // Format: "field:direction"
  keyword: Joi.string().min(1).max(100).optional().messages({
    'string.min': 'Keyword must be at least 1 character long',
    'string.max': 'Keyword cannot be longer than 100 characters'
  }), // Keyword search tối ưu cho vaccineName, vaccineType, targetAudience, creator info
  startDateFrom: Joi.date().iso().optional(), // Filter by start date range
  startDateTo: Joi.date().iso().optional(),
  // Legacy support
  sortBy: Joi.string().valid('startDate', 'createdAt', 'status').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional()
});

export const participationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  paging: Joi.number().integer().min(1).max(100).default(10), // Dùng 'paging' thay vì 'limit' theo BaseQueryBuilder
  parentConsent: Joi.string().valid('pending', 'approved', 'denied').optional(),
  vaccinationStatus: Joi.string().valid('scheduled', 'completed', 'missed', 'cancelled').optional(),
  sort: Joi.string().pattern(/^[a-zA-Z]+:(asc|desc)$/).default('createdAt:desc'), // Format: "field:direction"
  keyword: Joi.string().min(1).max(100).optional().messages({
    'string.min': 'Keyword must be at least 1 character long',
    'string.max': 'Keyword cannot be longer than 100 characters'
  }), // Global search cho campaign info, student info, notes, nurse info
  campaignId: Joi.string().optional(), // Filter by campaign
  studentId: Joi.string().optional(), // Filter by student
  consentDateFrom: Joi.date().iso().optional(), // Filter by consent date range
  consentDateTo: Joi.date().iso().optional(),
  vaccinationDateFrom: Joi.date().iso().optional(), // Filter by vaccination date range
  vaccinationDateTo: Joi.date().iso().optional(),
  // Legacy support
  sortBy: Joi.string().valid('createdAt', 'parentConsentDate', 'vaccinationDate').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional()
});
