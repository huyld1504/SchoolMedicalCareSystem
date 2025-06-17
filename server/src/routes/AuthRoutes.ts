import { isNumber } from "jet-validators";
import { transform } from "jet-validators/utils";

import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import UserService from "@src/services/UserService";

import { IReq, IRes } from "./common/types";
import { parseReq } from "./common/util";
import { loginSchema, userSchema } from "./common/util/validation";
import { ILoginResponseDto } from "@src/dto/dto.user";
import { ApiResponse } from "@src/common/util/util.api-response";
import { ValidationError } from "@src/common/util/util.route-errors";
import { User } from "@src/models/User";
import { log } from "console";
import { registerSchema } from "@src/schemas/user.schema";
import roleService from "@src/services/RoleService";
import { IRole } from "@src/models/Role";

/******************************************************************************
                                Constants
******************************************************************************/

const Validators = {
  login: parseReq(loginSchema),
  register: parseReq(userSchema),
} as const;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Login a user.
 */
async function login(req: IReq, res: IRes) {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const { email, password } = value;

  const loginResult = await UserService.login(email, password);
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Login successful",
    loginResult
  );
  res.status(HttpStatusCodes.OK).json(response);
}

/**
 * Register a user.
 */
async function register(req: IReq, res: IRes) {
  const { error, value } = registerSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  await UserService.register(value);
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.CREATED,
    "User registered successfully"
  );
  res.status(HttpStatusCodes.CREATED).json(response);
}

const verifyToken = async (req: IReq, res: IRes) => {
  const user = req.user;
  console.log(user);
  const userRole: IRole | null = await roleService.getById(user.roleId);
  if(!userRole) {
    throw new ValidationError("User role not found"); 
  }

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Token verified successfully",
    {
      id: user._id,
      email: user.email,
      role: userRole.name,
    });

    return res.status(HttpStatusCodes.OK).json(response);
}

export default {
  login,
  register,
  verifyToken
} as const;
