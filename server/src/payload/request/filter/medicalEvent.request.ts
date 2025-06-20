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
  }

  public buildFilter(): any {
    const filter: any = {};

    if (this.keyword) {
      filter.$or = [
        //fill query if have keyword
      ];
    }

    if(this.rawQuery?.type) {
      filter.type = this.rawQuery.type;
    }

    if(this.rawQuery?.level) {
      filter.level = this.rawQuery.level;
    }

    if (this.startDate) {
      filter.dateHappened = { $gte: this.startDate };
    }
    if (this.endDate) {
      filter.dateHappened = { ...filter.dateHappened, $lte: this.endDate };
    }
    if (this.status) {
      filter.status = this.status;
    }
    return filter;
  }
}