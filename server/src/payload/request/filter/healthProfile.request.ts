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
      filter.studentId = this.childId;
    }

    if (this.childIds && this.childIds.length > 0) {
      filter.studentId = { $in: this.childIds };
    }

    if (this.keyword) {
      filter.$or = [
        { bloodType: { $regex: this.keyword, $options: 'i' } },
        { allergies: { $regex: this.keyword, $options: 'i' } },
        { chronicDiseases: { $regex: this.keyword, $options: 'i' } }
      ];
    }

    return filter;
  }
}