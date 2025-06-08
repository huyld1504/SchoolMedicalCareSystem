import { BaseQueryBuilder } from "./base.request";

class MedicalRecordQueryBuilder extends BaseQueryBuilder {
  public startDate?: Date;
  public endDate?: Date;

  public buildFilter() {
    const filter: any = {};

    if (this.startDate) {
      filter.createdAt = { $gte: this.startDate };
    }
    if (this.endDate) {
      filter.createdAt = { ...filter.createdAt, $lte: this.endDate };
    }

    return filter;
  }
}

export { MedicalRecordQueryBuilder };
