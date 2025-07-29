import { PaginationOptions, PaginationResult, SortOptions } from './../common/interfaces/mongo.interface';
import { addHealthProfileSchema } from "@src/schemas/healthProfile.schema";
import { IReq, IRes } from "./common/types";
import { ApplicationError, ValidationError } from "@src/common/util/util.route-errors";
import healthProfileService from "@src/services/HealthProfileService";
import { ApiResponse } from '@src/common/util/util.api-response';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { HealthProfileQueryBuilder } from '@src/payload/request/filter/healthProfile.request';
import { Child } from '@src/models/Child';
import { IHealthProfile } from '@src/models/HealthProfile';
import roleService from '@src/services/RoleService';
import { child } from 'winston';
import childService from '@src/services/ChildService';

// Function to add a health profile
// This function validates the request body against the schema and adds a health profile for the user.
async function add(req: IReq, res: IRes) {
  const { error, value } = addHealthProfileSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const userId = (req.user as any)._id.toString();
  const student = await childService.getById(value.studentId);
  if (!student) {
    throw new ApplicationError("Không tìm thấy học sinh.");
  }

  await healthProfileService.addHealthProfile(value, userId);
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.CREATED,
    "Hồ sơ sức khỏe đã được thêm thành công"
  );
  res.status(HttpStatusCodes.CREATED).json(response);
}

// Function to search health profiles
// This function retrieves health profiles based on the query parameters provided in the request.
async function searchProfiles(req: IReq, res: IRes) {
  const queryBuilder = new HealthProfileQueryBuilder(req.query);
  const options: PaginationOptions = {
    page: queryBuilder.getPage(),
    limit: queryBuilder.getLimit()
  };
  const profiles = await healthProfileService.searchHealthProfiles(
    queryBuilder
  );

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Lấy hồ sơ sức khỏe thành công",
    profiles
  );

  res.status(HttpStatusCodes.OK).json(response);
}

// Function to get health profiles by child ID
// This function retrieves health profiles for a specific child based on their ID.
async function getByChildId(req: IReq, res: IRes) {
  const childId = req.params.childId as string;
  const query = new HealthProfileQueryBuilder(req.query);

  const student = await Child.findOne({ _id: childId });
  if (!student) {
    throw new ValidationError("Không tìm thấy học sinh.");
  }

  const profiles: PaginationResult<IHealthProfile> = await healthProfileService.findByChildIdWithPagination(
    childId,
    query
  );

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Lấy hồ sơ sức khỏe thành công",
    profiles
  );
  res.status(HttpStatusCodes.OK).json(response);
}

// Function to get health profiles by multiple child IDs
// This function retrieves health profiles for multiple children based on their IDs.
async function getByChildIds(req: IReq, res: IRes) {
  const childIds = req.body.childIds;
  if (!Array.isArray(childIds) || childIds.length === 0) {
    throw new ValidationError("Cần có danh sách ID con em.");
  }

  const query = new HealthProfileQueryBuilder(req.query);
  const profiles = await healthProfileService.findByChildIdsWithPagination(childIds, query);

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Lấy hồ sơ sức khỏe thành công",
    profiles
  );
  res.status(HttpStatusCodes.OK).json(response);
}

// Function to get health profile by ID
// This function retrieves a specific health profile by its ID.
async function getById(req: IReq, res: IRes) {
  const profileId = req.params.id as string;

  const profile = await healthProfileService.getHealthProfileById(profileId);
  if (!profile) {
    throw new ValidationError("Không tìm thấy hồ sơ sức khỏe.");
  }

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Lấy hồ sơ sức khỏe thành công",
    profile
  );
  res.status(HttpStatusCodes.OK).json(response);
}

// Function to update health profile by ID
// This function updates a specific health profile by its ID.
async function updateById(req: IReq, res: IRes) {
  const profileId = req.params.id as string;
  const { error, value } = addHealthProfileSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const updatedProfile = await healthProfileService.updateHealthProfile(profileId, value);
  if (!updatedProfile) {
    throw new ValidationError("Không tìm thấy hồ sơ sức khỏe để cập nhật.");
  }

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Cập nhật hồ sơ sức khỏe thành công",
    updatedProfile
  );
  res.status(HttpStatusCodes.OK).json(response);
}

export default {
  add,
  searchProfiles,
  getByChildId,
  getByChildIds,
  getById,
  updateById,
} as const;