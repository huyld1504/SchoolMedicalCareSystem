import { ApplicationError } from "@src/common/util/util.route-errors";
import { IRole, Role } from "@src/models/Role";

class RoleService {
  async add(name: string): Promise<void> {
    const roleExists = await Role.exists({ name });
    if (roleExists) {
      throw new ApplicationError("Role already exists");
    }
    Role.create({ name });
  }

  async getAll(): Promise<IRole[]> {
    const roles = await Role.find();
    if (!roles || roles.length === 0) {
      throw new ApplicationError("No roles found");
    }
    return roles;
  }

  async getById(id: string): Promise<IRole | null> {
    const role = await Role.findById(id);
    return role;
  }
}

const roleService = new RoleService();
export default roleService;
