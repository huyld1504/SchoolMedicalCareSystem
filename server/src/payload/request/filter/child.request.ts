import { BaseQueryBuilder } from "./base.request";

export class ChildQueryBuilder extends BaseQueryBuilder {
  public gender?: string;

  constructor(query: any) {
    super(query);
    this.gender = query.gender;
  }

  public buildFilter(): any {
    const filter: any = {};

    // Tìm kiếm keyword trên name hoặc studentCode
    if (this.keyword) {
      filter.$or = [
        { name: { $regex: this.keyword, $options: "i" } },
        { studentCode: { $regex: this.keyword, $options: "i" } },
      ];
    }

    // Lọc theo gender nếu có truyền
    if (this.gender) {
      filter.gender = this.gender;
    }

    return filter;
  }
}
