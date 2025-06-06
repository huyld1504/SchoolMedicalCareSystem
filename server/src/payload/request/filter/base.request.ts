export abstract class BaseQueryBuilder {
  protected readonly rawQuery: any;

  public page: number;
  public paging: number;
  public sort: Record<string, 1 | -1>;
  public keyword?: string;

  constructor(query: any) {
    this.rawQuery = query;

    this.page = this.parsePage(query.page);
    this.paging = this.parsePaging(query.paging);
    this.sort = this.parseSort(query.sort);
    this.keyword = this.parseKeyword(query.keyword);
  }

  protected parsePage(value: any): number {
    const page = parseInt(value);
    return !isNaN(page) && page > 0 ? page : 1;
  }

  protected parsePaging(value: any): number {
    const paging = parseInt(value);
    return !isNaN(paging) && paging > 0 ? paging : 10;
  }

  protected parseSort(value?: string): Record<string, 1 | -1> {
    if (!value) return { createdAt: -1 };

    const [field, direction] = value.split(":");
    return {
      [field]: direction === "asc" ? 1 : -1,
    };
  }

  protected parseKeyword(value?: string): string | undefined {
    return value?.trim() || undefined;
  }

  public getPage(): number {
    return this.page;
  }

  public getSkip(): number {
    return (this.page - 1) * this.paging;
  }

  public getLimit(): number {
    return this.paging;
  }

  public getSort(): Record<string, 1 | -1> {
    return this.sort;
  }

  public getKeyword(): string | undefined {
    return this.keyword;
  }

  // abstract method bắt buộc lớp con override
  public abstract buildFilter(): any;
}
