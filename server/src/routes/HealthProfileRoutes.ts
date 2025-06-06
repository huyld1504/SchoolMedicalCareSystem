import { PaginationOptions, SortOptions } from './../common/interfaces/mongo.interface';
import { addHealthProfileSchema } from "@src/schemas/healthProfile.schema";
import { IReq, IRes } from "./common/types";
import { ValidationError } from "@src/common/util/util.route-errors";
import healthProfileService from "@src/services/HealthProfileService";
import { ApiResponse } from '@src/common/util/util.api-response';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { HealthProfileQueryBuilder } from '@src/payload/request/filter/healthProfile.request';
import { Child } from '@src/models/Child';
import roleService from '@src/services/RoleService';

// Function to add a health profile
// This function validates the request body against the schema and adds a health profile for the user.
async function add(req: IReq, res: IRes) {
  const { error, value } = addHealthProfileSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }
    
  const userId = req.user._id.toString();
  console.log(userId);

  await healthProfileService.addHealthProfile(value, userId);
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.CREATED,
    "Health profile added successfully"
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
    queryBuilder,
    options,
    queryBuilder.getSort()
  );

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Health profiles retrieved successfully",
    profiles);

  res.status(HttpStatusCodes.OK).json(response);
}

// Function to get health profiles by child ID
// This function retrieves health profiles for a specific child based on their ID.
async function getByChildId(req: IReq, res: IRes) {
  const childId = req.params.childId;
  const user = req.user;

  const userRole = await roleService.getById(user.roleId.toString());

  if (!childId) {
    throw new ValidationError("Child ID is required.");
  }

  const student = await Child.findOne({ _id: childId });

  if (userRole.name === "parent" && student?.userId.toString() !== user._id.toString()) {
    throw new ValidationError("You do not have permission to access this child's health profile.");
  }

  const options: PaginationOptions = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
  };

  const sort: SortOptions = req.query.sort ? JSON.parse(req.query.sort as string) : undefined;

  const profiles = await healthProfileService.findByChildIdWithPagination(childId, options, sort);

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Health profiles retrieved successfully",
    profiles
  );
  res.status(HttpStatusCodes.OK).json(response);
}

// Function to get health profiles by multiple child IDs
// This function retrieves health profiles for multiple children based on their IDs.
async function getByChildIds(req: IReq, res: IRes) {
  const childIds = req.body.childIds;
  if (!Array.isArray(childIds) || childIds.length === 0) {
    throw new ValidationError("Child IDs are required.");
  }

  const options: PaginationOptions = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
  };

  const profiles = await healthProfileService.findByChildIdsWithPagination(childIds, options, req.query.sort);

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Health profiles retrieved successfully",
    profiles
  );
  res.status(HttpStatusCodes.OK).json(response);
}
export default {
  add,
  searchProfiles,
  getByChildId,
  getByChildIds,
} as const;