import { Handler, NextFunction, Request, Response } from "express";
import { Role } from "@src/models/Role";
import { AuthorizationError } from "@src/common/util/util.route-errors";

/**
 * Middleware kiểm tra xem user có thuộc bất kỳ vai trò nào trong danh sách không
 */
export const authRoles = (allowedRoles: string[]): Handler => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const role = await Role.findById(req.user.roleId);
      if (!role || !allowedRoles.includes(role.name)) {
        throw new AuthorizationError(
          `You do not have the required role. Required roles: ${allowedRoles.join(
            ", "
          )}`
        );
      }
      req.role = role.name;
      next();
    } catch (e: any) {
      throw new AuthorizationError(e.message || "Authorization failed");
    }
  };
};
