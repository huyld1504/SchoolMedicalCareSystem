import { isNumber } from "jet-validators";
import { transform } from "jet-validators/utils";

import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import UserService from "@src/services/UserService";

import { IReq, IRes } from "./common/types";
import { parseReq } from "./common/util";
import { userSchema } from "./common/util/validation";
import { ApiResponse } from "@src/common/util/util.api-response";
import { ValidationError } from "@src/common/util/util.route-errors";
import { addUserSchema } from "@src/schemas/user.schema";

/******************************************************************************
                                Constants
******************************************************************************/

const Validators = {
  add: parseReq({ user: userSchema }),
  update: parseReq({ user: userSchema }),
  delete: parseReq({ id: transform(Number, isNumber) }),
} as const;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll();
  res.status(HttpStatusCodes.OK).json({ users });
}

/**
 * Add one user.
 */
async function add(req: IReq, res: IRes) {
  const { error, value } = addUserSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }
  await UserService.addOne(value);
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.CREATED,
    "User created successfully"
  );
  res.status(HttpStatusCodes.CREATED).json(response);
}

/**
 * Update one user.
 */
async function update(req: IReq, res: IRes) {
  const { user } = Validators.update(req.body);
  await UserService.updateOne(user);
  res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 */
async function delete_(req: IReq, res: IRes) {
  const { id } = Validators.delete(req.params);
  await UserService.delete(id);
  res.status(HttpStatusCodes.OK).end();
}

async function getUsersWithPagination(req: IReq, res: IRes) {
  const { page, limit } = req.query;
  const options = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  };
  const users = await UserService.getUsersWithPagination(options);
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Users retrieved successfully",
    users
  );
  res.status(HttpStatusCodes.OK).json(response);
}

async function searchUsers(req: IReq, res: IRes) {
  const { query, page, limit } = req.query as {
    query?: string;
    page?: string;
    limit?: string;
  };
  const options = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  };
  const users = await UserService.searchUsers(query || "", options);
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Users retrieved successfully",
    users
  );
  res.status(HttpStatusCodes.OK).json(response);
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  add,
  update,
  delete: delete_,
  getUsersWithPagination,
  searchUsers,
} as const;
