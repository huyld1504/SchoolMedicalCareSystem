import { BaseQueryBuilder } from "./base.request";

export class MedicalEventQueryBuilder extends BaseQueryBuilder {
  constructor(query: any) {
    super(query);
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

    return filter;
  }
}