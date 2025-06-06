import { BaseQueryBuilder } from "./base.request";

export class HealthProfileQueryBuilder extends BaseQueryBuilder {
  public childId?: string;
  public childIds?: string[];

  constructor(query: any) {
    super(query);
    this.childId = query.childId;
    this.childIds = query.childIds;
  }

  public buildFilter(): any {
    const filter: any = {};

    if (this.childId) {
      filter.childId = this.childId;
    }

    if (this.childIds && this.childIds.length > 0) {
      filter.childId = { $in: this.childIds };
    }

    if (this.keyword) {
      filter.$or = [
        { studentName: { $regex: this.keyword, $options: 'i' } },
        { medicalCoverageId: { $regex: this.keyword, $options: 'i' } }
      ];
    }

    return filter;
  }
}