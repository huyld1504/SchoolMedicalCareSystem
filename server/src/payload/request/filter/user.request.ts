import { BaseQueryBuilder } from "./base.request";

export class UserQueryBuilder extends BaseQueryBuilder {
  public roleId?: string;
  constructor(query: any) {
    super(query);
    this.keyword = query.keyword || "";
    this.roleId = query.roleId ? String(query.roleId) : undefined;
  }

  public async buildFilter(): Promise<any> {
    const filter: any = {};

    // Existing filters
    if (this.keyword) {
      filter.$or = [
        { name: { $regex: this.keyword, $options: "i" } },
        { email: { $regex: this.keyword, $options: "i" } },
      ];
    }

    // New filter for roleId
    if (this.roleId) {
      filter.roleId = this.roleId;
    }

    return filter;
  }
}
