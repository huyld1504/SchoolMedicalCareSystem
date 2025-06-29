import { BaseQueryBuilder } from "./base.request";

export class MedicalEventQueryBuilder extends BaseQueryBuilder {
  public startDate?: Date;
  public endDate?: Date;
  public status?: string;
  constructor(query: any) {
    super(query);
    this.startDate = query.startDate ? new Date(query.startDate) : undefined;
    this.endDate = query.endDate ? new Date(query.endDate) : undefined;
    this.status = query.status;
  } public buildFilter(): any {
    const filter: any = {};

    if (this.keyword) {
      filter.$or = [
        { description: { $regex: this.keyword, $options: 'i' } },
        { note: { $regex: this.keyword, $options: 'i' } },
        { solution: { $regex: this.keyword, $options: 'i' } },
      ];
    }

    if (this.rawQuery?.type) {
      filter.type = this.rawQuery.type;
    }

    if (this.rawQuery?.level) {
      // Convert to number if it's a string
      filter.level = typeof this.rawQuery.level === 'string'
        ? parseInt(this.rawQuery.level, 10)
        : this.rawQuery.level;
    }

    // Fix date filter logic
    const dateFilter: any = {};
    if (this.startDate) {
      dateFilter.$gte = this.startDate;
    }
    if (this.endDate) {
      dateFilter.$lte = this.endDate;
    }
    if (Object.keys(dateFilter).length > 0) {
      filter.dateHappened = dateFilter;
    }

    if (this.status) {
      filter.status = this.status;
    }
    return filter;
  }
}