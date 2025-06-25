import { BaseQueryBuilder } from "./base.request";

export class VaccinationCampaignQueryBuilder extends BaseQueryBuilder {
  public status?: string;
  public startDateFrom?: Date;
  public startDateTo?: Date;
  public endDateFrom?: Date;
  public endDateTo?: Date;

  constructor(query: any) {
    super(query);
    this.status = this.parseStatus(query.status);
    this.startDateFrom = this.parseDate(query.startDateFrom);
    this.startDateTo = this.parseDate(query.startDateTo);
    this.endDateFrom = this.parseDate(query.endDateFrom);
    this.endDateTo = this.parseDate(query.endDateTo);
  }
  protected parseStatus(value?: string): string | undefined {
    const validStatuses = ['planned', 'ongoing', 'completed', 'cancelled'];
    return value && value.trim() && validStatuses.includes(value) ? value : undefined;
  }

  protected parseDate(value?: string): Date | undefined {
    if (!value ) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }
  public buildFilter(): any {
    const filter: any = {};

    // Filter by status
    if (this.status) {
      filter.status = this.status;
    }

    // Keyword search được handle ở repository level với aggregation
    // để có thể search trong related collections (creator info)
    // Không cần thêm vào filter ở đây    // Filter by start date range
    if (this.startDateFrom || this.startDateTo) {
      filter.startDate = {};
      if (this.startDateFrom) {
        filter.startDate.$gte = this.startDateFrom;
      }
      if (this.startDateTo) {
        filter.startDate.$lte = this.startDateTo;
      }
    }

    // Filter by end date range
    if (this.endDateFrom || this.endDateTo) {
      filter.endDate = {};
      if (this.endDateFrom) {
        filter.endDate.$gte = this.endDateFrom;
      }
      if (this.endDateTo) {
        filter.endDate.$lte = this.endDateTo;
      }
    }

    return filter;
  }

  /**
   * Build keyword search for aggregation pipeline
   * Search trong campaign fields và creator info
   */
  public buildKeywordMatch(): any {
    if (!this.keyword) return {};

    return {
      $or: [
        // Search trong campaign info
        { vaccineName: { $regex: this.keyword, $options: 'i' } },
        { vaccineType: { $regex: this.keyword, $options: 'i' } },
        { targetAudience: { $regex: this.keyword, $options: 'i' } },

        // Search trong creator info
        { 'createdByInfo.name': { $regex: this.keyword, $options: 'i' } },
        { 'createdByInfo.email': { $regex: this.keyword, $options: 'i' } }
      ]
    };
  }
}

export class VaccinationParticipationQueryBuilder extends BaseQueryBuilder {
  public parentConsent?: string;
  public vaccinationStatus?: string;
  public campaignId?: string;
  public studentId?: string;
  public consentDateFrom?: Date;
  public consentDateTo?: Date;
  public vaccinationDateFrom?: Date;
  public vaccinationDateTo?: Date;
  constructor(query: any) {
    super(query);
    this.parentConsent = this.parseParentConsent(query.parentConsent);
    this.vaccinationStatus = this.parseVaccinationStatus(query.vaccinationStatus);
    this.campaignId = query.campaignId && query.campaignId.trim() ? query.campaignId : undefined;
    this.studentId = query.studentId && query.studentId.trim() ? query.studentId : undefined;
    this.consentDateFrom = this.parseDate(query.consentDateFrom);
    this.consentDateTo = this.parseDate(query.consentDateTo);
    this.vaccinationDateFrom = this.parseDate(query.vaccinationDateFrom);
    this.vaccinationDateTo = this.parseDate(query.vaccinationDateTo);
  }
  protected parseParentConsent(value?: string): string | undefined {
    const validConsents = ['pending', 'approved', 'denied'];
    return value && value.trim() && validConsents.includes(value) ? value : undefined;
  }

  protected parseVaccinationStatus(value?: string): string | undefined {
    const validStatuses = ['scheduled', 'completed', 'missed', 'cancelled'];
    return value && value.trim() && validStatuses.includes(value) ? value : undefined;
  }

  protected parseDate(value?: string): Date | undefined {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }

  public buildFilter(): any {
    const filter: any = {};

    // Filter by campaign
    if (this.campaignId) {
      filter.campaign = this.campaignId;
    }

    // Filter by student
    if (this.studentId) {
      filter.student = this.studentId;
    }

    // Filter by parent consent
    if (this.parentConsent) {
      filter.parentConsent = this.parentConsent;
    }

    // Filter by vaccination status
    if (this.vaccinationStatus) {
      filter.vaccinationStatus = this.vaccinationStatus;
    }

    // Keyword search - sẽ cần populate để search trong related fields
    // Keyword search sẽ được handle ở repository level với aggregation
    // để có thể search trong campaign info và student info

    // Filter by consent date range
    if (this.consentDateFrom || this.consentDateTo) {
      filter.parentConsentDate = {};
      if (this.consentDateFrom) {
        filter.parentConsentDate.$gte = this.consentDateFrom;
      }
      if (this.consentDateTo) {
        filter.parentConsentDate.$lte = this.consentDateTo;
      }
    }

    // Filter by vaccination date range
    if (this.vaccinationDateFrom || this.vaccinationDateTo) {
      filter.vaccinationDate = {};
      if (this.vaccinationDateFrom) {
        filter.vaccinationDate.$gte = this.vaccinationDateFrom;
      }
      if (this.vaccinationDateTo) {
        filter.vaccinationDate.$lte = this.vaccinationDateTo;
      }
    }

    return filter;
  }
  /**
   * Build keyword search for aggregation pipeline
   * Search trong campaign info, student info, và notes
   */
  public buildKeywordMatch(): any {
    if (!this.keyword) return {};

    return {
      $or: [
        // Search trong campaign info
        { 'campaignInfo.vaccineName': { $regex: this.keyword, $options: 'i' } },
        { 'campaignInfo.vaccineType': { $regex: this.keyword, $options: 'i' } },
        { 'campaignInfo.targetAudience': { $regex: this.keyword, $options: 'i' } },

        // Search trong student info
        { 'studentInfo.name': { $regex: this.keyword, $options: 'i' } },
        { 'studentInfo.studentCode': { $regex: this.keyword, $options: 'i' } },

        // Search trong notes
        { 'parentNote': { $regex: this.keyword, $options: 'i' } },
        { 'nurseNote': { $regex: this.keyword, $options: 'i' } },

        // Search trong nurse info
        { 'nurseInfo.name': { $regex: this.keyword, $options: 'i' } },
        { 'nurseInfo.email': { $regex: this.keyword, $options: 'i' } },

        // Search trong creator info
        { 'createdByInfo.name': { $regex: this.keyword, $options: 'i' } },
        { 'createdByInfo.email': { $regex: this.keyword, $options: 'i' } }
      ]
    };
  }
}
