import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { ApiResponse } from "@src/common/util/util.api-response";
import { ValidationError, ApplicationError } from "@src/common/util/util.route-errors";
import VaccinationService from "@src/services/VaccinationService";
import { Role } from "@src/models/Role";
import {
  createCampaignSchema,
  updateCampaignSchema,
  addStudentsToCampaignSchema,
  parentConsentSchema,
  nurseRecordSchema,
  campaignQuerySchema,
  participationQuerySchema
} from "@src/schemas/vaccination.schema";
import { VaccinationCampaignQueryBuilder, VaccinationParticipationQueryBuilder } from "@src/payload/request/filter/vaccination.request";

import { IReq, IRes } from "./common/types";

/******************************************************************************
                            Helper Functions
******************************************************************************/

/**
 * Get user role name from roleId
 */
async function getUserRole(req: IReq): Promise<string> {
  if (!req.user) {
    throw new ValidationError("User authentication required");
  }

  const role = await Role.findById(req.user.roleId);
  if (!role) {
    throw new ValidationError("User role not found");
  }

  return role.name;
}

/******************************************************************************
                            Vaccination Campaign Controllers
******************************************************************************/

/**
 * Tạo chiến dịch tiêm chủng (Admin only)
 */
async function createCampaign(req: IReq, res: IRes) {
  const { error, value } = createCampaignSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  if (!req.user) {
    throw new ValidationError("User authentication required");
  }

  const campaign = await VaccinationService.createCampaign(value, req.user.id.toString());

  const response = new ApiResponse(
    HttpStatusCodes.CREATED,
    "Vaccination campaign created successfully",
    campaign
  );
  res.status(HttpStatusCodes.CREATED).json(response);
}

/**
 * Cập nhật chiến dịch tiêm chủng (Admin only)
 */
async function updateCampaign(req: IReq, res: IRes) {
  const { error, value } = updateCampaignSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  if (!req.user) {
    throw new ValidationError("User authentication required");
  }

  const { campaignId } = req.params;
  const campaign = await VaccinationService.updateCampaign(
    campaignId as string,
    value,
    req.user.id.toString()
  );

  const response = new ApiResponse(
    HttpStatusCodes.OK,
    "Vaccination campaign updated successfully",
    campaign
  );
  res.status(HttpStatusCodes.OK).json(response);
}

/**
 * Lấy tất cả chiến dịch (Role-based)
 */
async function getAllCampaigns(req: IReq, res: IRes) {
  const { error, value } = campaignQuerySchema.validate(req.query);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  if (!req.user) {
    throw new ValidationError("User authentication required");
  }

  const userRole = await getUserRole(req);
  const { page, limit, status, sortBy, sortOrder } = value;
  const options = { page, limit };
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as any;

  const campaigns = await VaccinationService.getAllCampaigns(
    userRole,
    req.user.id.toString(),
    options,
    sort
  );

  const response = new ApiResponse(
    HttpStatusCodes.OK,
    "Vaccination campaigns retrieved successfully",
    campaigns
  );
  res.status(HttpStatusCodes.OK).json(response);
}

/**
 * Lấy chiến dịch theo ID (Role-based)
 */
async function getCampaignById(req: IReq, res: IRes) {
  if (!req.user) {
    throw new ValidationError("User authentication required");
  }

  const userRole = await getUserRole(req);
  const { campaignId } = req.params;

  const campaign = await VaccinationService.getCampaignById(
    campaignId as string,
    userRole,
    req.user.id.toString()
  );

  const response = new ApiResponse(
    HttpStatusCodes.OK,
    "Vaccination campaign retrieved successfully",
    campaign
  );
  res.status(HttpStatusCodes.OK).json(response);
}

/**
 * Thêm học sinh vào chiến dịch (Admin only)
 */
async function addStudentsToCampaign(req: IReq, res: IRes) {
  const { error, value } = addStudentsToCampaignSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  if (!req.user) {
    throw new ValidationError("User authentication required");
  }

  const { campaignId } = req.params;
  const { studentIds } = value;

  await VaccinationService.addStudentsToCampaign(
    campaignId as string,
    studentIds,
    req.user.id.toString()
  );

  const response = new ApiResponse(
    HttpStatusCodes.OK,
    "Students added to campaign successfully"
  );
  res.status(HttpStatusCodes.OK).json(response);
}

/**
 * Search chiến dịch tiêm chủng với filters nâng cao (Role-based)
 */
async function searchCampaigns(req: IReq, res: IRes) {
  const { error, value } = campaignQuerySchema.validate(req.query);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  if (!req.user) {
    throw new ValidationError("User authentication required");
  }

  const userRole = await getUserRole(req);
  const queryBuilder = new VaccinationCampaignQueryBuilder(value);

  const campaigns = await VaccinationService.searchCampaigns(
    userRole,
    req.user.id.toString(),
    queryBuilder
  );

  const response = new ApiResponse(
    HttpStatusCodes.OK,
    "Vaccination campaigns searched successfully",
    campaigns
  );
  res.status(HttpStatusCodes.OK).json(response);
}

/******************************************************************************
                        Vaccination Participation Controllers
******************************************************************************/

/**
 * Lấy danh sách tham gia chiến dịch (Role-based)
 */
async function getCampaignParticipations(req: IReq, res: IRes) {
  const { error, value } = participationQuerySchema.validate(req.query);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  if (!req.user) {
    throw new ValidationError("User authentication required");
  }

  const userRole = await getUserRole(req);
  const { campaignId } = req.params;
  const { page, limit, parentConsent, vaccinationStatus, sortBy, sortOrder } = value;
  const options = { page, limit: limit || 10 }; // Default limit to 10 if not provided
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as any;

  const participations = await VaccinationService.getCampaignParticipations(
    campaignId as string,
    userRole,
    req.user.id.toString(),
    { parentConsent, vaccinationStatus },
    options,
    sort
  );

  const response = new ApiResponse(
    HttpStatusCodes.OK,
    "Campaign participations retrieved successfully",
    participations
  );
  res.status(HttpStatusCodes.OK).json(response);
}

/**
 * Phụ huynh đồng ý/từ chối cho con tham gia (Parent only)
 */
async function parentConsent(req: IReq, res: IRes) {
  const { error, value } = parentConsentSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  if (!req.user) {
    throw new ValidationError("User authentication required");
  }

  const { participationId } = req.params;
  const { consent, note } = value;

  await VaccinationService.parentConsent(
    participationId as string,
    consent,
    note,
    req.user.id.toString()
  );

  const response = new ApiResponse(
    HttpStatusCodes.OK,
    "Parent consent recorded successfully"
  );
  res.status(HttpStatusCodes.OK).json(response);
}

/**
 * Y tá ghi nhận kết quả tiêm (Nurse only)
 */
async function recordVaccination(req: IReq, res: IRes) {
  const { error, value } = nurseRecordSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  if (!req.user) {
    throw new ValidationError("User authentication required");
  }
  const { participationId } = req.params;
  const { status, note } = value; // vaccinationDate sẽ được tự động set ở repository

  await VaccinationService.recordVaccination(
    participationId as string,
    req.user.id.toString(),
    status,
    note
  );

  const response = new ApiResponse(
    HttpStatusCodes.OK,
    "Vaccination result recorded successfully"
  );
  res.status(HttpStatusCodes.OK).json(response);
}

/**
 * Search danh sách tham gia với filters nâng cao (Role-based)
 */
async function searchParticipations(req: IReq, res: IRes) {
  const { error, value } = participationQuerySchema.validate(req.query);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  if (!req.user) {
    throw new ValidationError("User authentication required");
  }

  const queryBuilder = new VaccinationParticipationQueryBuilder(value);

  const participations = await VaccinationService.searchParticipations(queryBuilder);

  const response = new ApiResponse(
    HttpStatusCodes.OK,
    "Vaccination participations searched successfully",
    participations
  );
  res.status(HttpStatusCodes.OK).json(response);
}

/**
 * Search danh sách tham gia của phụ huynh với filters nâng cao (Parent only)
 */
async function searchParentParticipations(req: IReq, res: IRes) {
  const { error, value } = participationQuerySchema.validate(req.query);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  if (!req.user) {
    throw new ValidationError("User authentication required");
  }

  const queryBuilder = new VaccinationParticipationQueryBuilder(value);

  const participations = await VaccinationService.searchParentParticipations(
    req.user.id.toString(),
    queryBuilder
  );

  const response = new ApiResponse(
    HttpStatusCodes.OK,
    "Parent participations searched successfully",
    participations
  );
  res.status(HttpStatusCodes.OK).json(response);
}

/******************************************************************************
                                    Export
******************************************************************************/

export default {
  // Campaign management
  createCampaign,
  updateCampaign,
  getAllCampaigns,
  getCampaignById,
  addStudentsToCampaign,
  searchCampaigns,

  // Participation management
  getCampaignParticipations,
  parentConsent,
  recordVaccination,
  searchParticipations,
  searchParentParticipations,
} as const;
