import { addHealthProfileSchema, updateHealthProfileSchema } from "@src/schemas/healthProfile.schema";
import {
  PaginationOptions,
  SortOptions,
} from "./../common/interfaces/mongo.interface";
import {
  addHealthProfileSchema,
  updateHealthProfileSchema,
} from "@src/schemas/healthProfile.schema";
import { IReq, IRes } from "./common/types";
import { AuthorizationError, ValidationError } from "@src/common/util/util.route-errors";
import healthProfileService from "@src/services/HealthProfileService";
import { ApiResponse } from '@src/common/util/util.api-response';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { HealthProfileQueryBuilder } from '@src/payload/request/filter/healthProfile.request';
import { Child } from '@src/models/Child';
import { HealthProfile } from "@src/models/HealthProfile";
import childService from "@src/services/ChildService";
import roleService from "@src/services/RoleService";
import { Role } from "@src/models/Role";

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

  const profiles = await healthProfileService.searchHealthProfiles(
    queryBuilder
  );

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Health profiles retrieved successfully",
    profiles
  );

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

  // Check if the user is a parent or guardian of the child
  if (userRole.name === "parent") {
    const child = await Child.findOne({ _id: childId, userId: user._id });
    if (!child) {
      throw new AuthorizationError("You do not have permission to access this child's health profile.");
    }
  }

  const query = new HealthProfileQueryBuilder(req.query);
  query.childId = childId as string;

  const profiles = await healthProfileService.findByChildIdWithPagination(
    query.childId,
    query
  );

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

  const query = new HealthProfileQueryBuilder(req.query);
  query.childIds = childIds;

  const profiles = await healthProfileService.findByChildIdsWithPagination(
    childIds,
    query
  );

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Health profiles retrieved successfully",
    profiles
  );
  res.status(HttpStatusCodes.OK).json(response);
}

// Function to get a health profile by ID
// This function retrieves a specific health profile based on its ID.
async function getById(req: IReq, res: IRes) {
  const profileId = req.params.id as string;
  const user = req.user as any;
  const userRole = await Role.findById(user.roleId.toString()) as any;
  if (!profileId) {
    throw new ValidationError("Health profile ID is required.");
  }

  if(userRole.name === "parent") {
    const child = await Child.findOne({userId: user._id.toString() as string}) as any;
    if(!child) {
      throw new AuthorizationError("You do not have permission to access this health profile.");
    }
  }

  const profile = await healthProfileService.getHealthProfileById(profileId);
  if (!profile) {
    throw new ValidationError("Health profile not found.");
  }

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Health profile retrieved successfully",
    profile
  );
  res.status(HttpStatusCodes.OK).json(response);
}

async function updateById(req: IReq, res: IRes) {
  const profileId = req.params.id as string;
  if (!profileId) {
    throw new ValidationError("Health profile ID is required.");
  }

  const { error, value } = updateHealthProfileSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const updatedProfile = await healthProfileService.updateHealthProfile(
    profileId,
    value
  );
  if (!updatedProfile) {
    throw new ValidationError("Health profile not found.");
  }
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Health profile updated successfully",
    updatedProfile
  );

  res.status(HttpStatusCodes.OK).json(response);
}

// Exporting the functions as a module
export default {
  add,
  searchProfiles,
  getByChildId,
  getByChildIds,
  getById,
  updateById,
} as const;
