import { Child } from "@src/models/Child";
import { BaseQueryBuilder } from "./base.request";

export class OrderMedicalQueryBuilder extends BaseQueryBuilder {
  public childId?: string;
  public childIds?: string[];
  public status?: string[];
  public startDate?: Date;
  public endDate?: Date;
  constructor(query: any) {
    super(query);
    this.childId = query.childId;
    this.childIds = query.childIds;
    this.status = query.status
      ? Array.isArray(query.status)
        ? query.status
        : [query.status]
      : undefined;
    this.startDate = query.startDate ? new Date(query.startDate) : undefined;
    this.endDate = query.endDate ? new Date(query.endDate) : undefined;
  }

  public async buildFilter(role?: string, userId?: string): Promise<any> {
    const filter: any = {};

    // Existing filters
    if (this.childId) {
      filter.ChildId = this.childId;
    }
    if (this.childIds && this.childIds.length > 0) {
      filter.ChildId = { $in: this.childIds };
    }
    if (this.status && this.status.length > 0) {
      filter.status = { $in: this.status };
    }
    if (this.startDate) {
      filter.startDate = { $gte: this.startDate };
    }
    if (this.endDate) {
      filter.endDate = { $lte: this.endDate };
    }

    // Handle parent role filter
    if (role === "parent" && userId) {
      const childIds = await this.getChildIdsForParent(userId);
      if (childIds.length > 0) {
        filter.ChildId = filter.ChildId
          ? { $in: this.childIds?.filter((id) => childIds.includes(id)) }
          : { $in: childIds };
      } else {
        // Return empty result if parent has no children
        filter.ChildId = { $in: [] };
      }
    }

    return filter;
  }

  private async getChildIdsForParent(parentId: string): Promise<string[]> {
    const children = await Child.find({ userId: parentId })
      .select("_id")
      .lean();
    return children.map((child) => child._id.toString());
  }
}
