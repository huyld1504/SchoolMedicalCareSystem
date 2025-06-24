import {
  ApplicationError,
  RouteError,
} from "@src/common/util/util.route-errors";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";

import { UserRepository } from "@src/repos/UserRepo";
import { IUser, User } from "@src/models/User";
import { IToken, signToken } from "@src/common/libs/lib.jwt";
import { InsertResult } from "typeorm";
import { ILoginResponseDto } from "@src/dto/dto.user";
import {
  PaginationOptions,
  PaginationResult,
} from "@src/common/interfaces/mongo.interface";
import {
  IAddUserRequest,
  IRegisterRequest,
} from "@src/payload/request/user.request";
import { IRole, Role } from "@src/models/Role";
import { UserQueryBuilder } from "@src/payload/request/filter/user.request";

/******************************************************************************
                                Constants
******************************************************************************/

export const USER_NOT_FOUND_ERR = "User not found";

/******************************************************************************
                                Functions
******************************************************************************/
class UserService {
  private userRepo = new UserRepository();
  async getAll(): Promise<IUser[]> {
    return this.userRepo.getAll();
  }
  async addOne(user: IAddUserRequest): Promise<void> {
    const exists = await this.userRepo.findByEmail(user.email);

    if (exists) {
      throw new ApplicationError("Email already exists");
    }
    const existsRole = await Role.findById(user.roleId);
    if (!existsRole) {
      throw new ApplicationError("Role does not exist");
    }
    if (existsRole.name === "admin") {
      throw new ApplicationError("You cannot create a user with admin role");
    }
    const saveUser = new User(user);
    saveUser.roleId = existsRole.id;
    await saveUser.save();
  }
  async updateOne(user: IUser): Promise<void> {
    const persists = await this.userRepo.persists(user.id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
    }
    return this.userRepo.update_(user);
  }
  async delete(id: number): Promise<void> {
    const persists = await this.userRepo.persists(id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
    }
    return this.userRepo.delete_(id);
  }
  async getUsersWithPagination(
    queryBuilder: UserQueryBuilder
  ): Promise<PaginationResult<IUser>> {
    const filter = await queryBuilder.buildFilter();
    const query = User.find(filter)
      .lean()
      .skip(queryBuilder.getSkip())
      .limit(queryBuilder.getLimit())
      .sort(queryBuilder.getSort());

    const [users, totalCount] = await Promise.all([
      query.exec(),
      User.countDocuments(filter),
    ]);
    return {
      records: users,
      total: totalCount,
      page: queryBuilder.getPage(),
      limit: queryBuilder.getLimit(),
      totalPages: Math.ceil(totalCount / queryBuilder.getLimit()),
    };
  }
  async searchUsers(
    query: string,
    options: PaginationOptions
  ): Promise<PaginationResult<IUser>> {
    return this.userRepo.searchUsers(query, options);
  }
  async login(
    email: string,
    password: string
  ): Promise<ILoginResponseDto | null> {
    const user = await User.findOne({ email })
      .select("id email password firstName lastName")
      .populate<{ roleId: IRole }>("roleId", "name")
      .exec();
    if (!user) {
      throw new ApplicationError("User or password is incorrect");
    }
    if (user.password !== password) {
      throw new ApplicationError("Invalid password");
    }
    const payloadToken: Record<string, any> = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.roleId ? user.roleId.name : "user",
    };
    const token: IToken = await signToken(payloadToken, {
      expiredAt: 1,
      type: "days",
    });

    const response: ILoginResponseDto = {
      email: user.email,
      id: user.id,
      name: user.name,
      token: token.accessToken,
      refreshToken: token.refreshToken,
      role: user.roleId ? user.roleId.name : "user",
    };

    return response;
  }
  async register(user: IRegisterRequest): Promise<void> {
    const exists = await this.userRepo.findByEmail(user.email);
    if (exists) {
      throw new ApplicationError("Email already exists");
    }
    const saveUser = new User(user);
    const roleAdmin = await Role.findOne({ name: "admin" });
    saveUser.roleId = roleAdmin ? roleAdmin.id : null;
    const result = await this.userRepo.add(saveUser);
    return result;
  }
}

const userService = new UserService();
export default userService;
