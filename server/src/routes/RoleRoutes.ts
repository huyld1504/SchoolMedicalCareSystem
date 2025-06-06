import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { IReq, IRes } from "./common/types";
import roleService from "@src/services/RoleService";
import { ApiResponse } from "@src/common/util/util.api-response";

async function add(req: IReq, res: IRes) {
  const { role } = req.body as { role: string };
  await roleService.add(role);
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.CREATED,
    "Role created successfully",
    { role }
  );
  res.status(HttpStatusCodes.CREATED).json(response);
}

async function getAll(req: IReq, res: IRes) {
  const roles = await roleService.getAll();
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Roles retrieved successfully",
    roles
  );
  res.status(HttpStatusCodes.OK).json(response);
}

export default {
  add,
  getAll,
} as const;
