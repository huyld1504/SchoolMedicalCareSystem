import { Handler, NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { verifyToken } from "@src/common/libs/lib.jwt";
import { AuthorizationError } from "@src/common/util/util.route-errors";
import { User } from "@src/models/User";
import { Role } from "@src/models/Role";

export const authNurse = (): Handler => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const role = await Role.findById(req.user.roleId);
      if (!role || role.name !== "nurse") {
        throw new AuthorizationError("You do not have nurse privileges");
      }
      next();
    } catch (e: any) {
      throw new AuthorizationError(e.message);
    }
  };
};
