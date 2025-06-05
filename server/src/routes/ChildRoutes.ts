import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { IReq, IRes } from "./common/types";

import { ApiResponse } from "@src/common/util/util.api-response";
import { addChildSchema } from "@src/schemas/user.schema";
import { ValidationError } from "@src/common/util/util.route-errors";
import childService from "@src/services/ChildService";
import { ChildQueryBuilder } from "@src/payload/request/filter/child.request";

async function add(req: IReq, res: IRes) {
  const { error, value } = addChildSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }
  await childService.add(value, req.user._id);
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.CREATED,
    "Child added successfully"
  );
  res.status(HttpStatusCodes.CREATED).json(response);
}

async function get(req: IReq, res: IRes) {
  const queryBuilder = new ChildQueryBuilder(req.query);
  const children = await childService.getChilds(
    queryBuilder,
    req.user._id,
    req.role
  );
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Children retrieved successfully",
    children
  );
  res.status(HttpStatusCodes.OK).json(response);
}

export default {
  add,
  get,
} as const;
