import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { IReq, IRes } from "./common/types";

import { ApiResponse } from "@src/common/util/util.api-response";
import { addChildSchema } from "@src/schemas/user.schema";
import { ValidationError } from "@src/common/util/util.route-errors";
import childService from "@src/services/ChildService";
import { ChildQueryBuilder } from "@src/payload/request/filter/child.request";
import { Child } from "@src/models/Child";
import { Role } from "@src/models/Role";

async function add(req: IReq, res: IRes) {
  const { error, value } = addChildSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }
  await childService.add(value, req.user._id);
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.CREATED,
    "Thêm học sinh thành công"
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
    "Lấy danh sách học sinh thành công",
    children
  );
  res.status(HttpStatusCodes.OK).json(response);
}

async function getById(req: IReq, res: IRes) {
  const childId = req.params.id;
  if (!childId) {
    throw new ValidationError("Yêu cầu ID học sinh");
  }

  const userRole = await Role.findById(req.user?.roleId);
  if (userRole?.name === "parent") {
    const child = await Child.findOne({ _id: childId, userId: req.user?._id });
    if (!child) {
      throw new ValidationError("Không tìm thấy học sinh hoặc bạn không có quyền truy cập dữ liệu của học sinh này");
    }
    const response: ApiResponse = new ApiResponse(
      HttpStatusCodes.OK,
      "Lấy thông tin học sinh thành công",
      child
    );
    return res.status(HttpStatusCodes.OK).json(response);
  }
  const child = await Child.findById(childId);
  if (!child) {
    throw new ValidationError("Không tìm thấy học sinh");
  }
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Lấy thông tin học sinh thành công",
    child
  );
  res.status(HttpStatusCodes.OK).json(response);
}

export default {
  add,
  get,
  getById,
} as const;
