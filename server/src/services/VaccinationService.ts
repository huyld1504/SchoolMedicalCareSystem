import { ApplicationError } from "@src/common/util/util.route-errors";
import { PaginationOptions, PaginationResult, SortOptions } from "@src/common/interfaces/mongo.interface";
import { VaccinationCampaignRepository } from "@src/repos/VaccinationCampaignRepo";
import { VaccinationParticipationRepository } from "@src/repos/VaccinationParticipationRepo";
import { IVaccinationCampaign } from "@src/models/VaccinationCampaign";
import { IVaccinationParticipation } from "@src/models/VaccinationParticipation";
import { Types } from "mongoose";
import { VaccinationCampaignQueryBuilder, VaccinationParticipationQueryBuilder } from "@src/payload/request/filter/vaccination.request";

class VaccinationService {
  private campaignRepo = new VaccinationCampaignRepository();
  private participationRepo = new VaccinationParticipationRepository();

  /**
   * 1. Tạo chiến dịch tiêm chủng (Admin only)
   */
  async createCampaign(
    campaignData: Partial<IVaccinationCampaign>,
    adminId: string
  ): Promise<void> {
    await this.campaignRepo.create({
      ...campaignData,
      createdBy: new Types.ObjectId(adminId),
      status: "planned"
    } as IVaccinationCampaign);

  }

  /**
   * 2. Thay đổi thông tin chiến dịch (Admin only)
   */
  async updateCampaign(
    campaignId: string,
    updateData: Partial<IVaccinationCampaign>,
    adminId: string
  ): Promise<void> {
    await this.campaignRepo.updateCampaign(campaignId, updateData, adminId);
  }

  /**
   * 3. Xem tất cả chiến dịch (Role-based)
   */
  async getAllCampaigns(
    role: string,
    userId: string,
    options: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<IVaccinationCampaign>> {
    return this.campaignRepo.getCampaignsWithRoleFilter(role, userId, options, sort);
  }

  /**
   * 4. Xem chiến dịch theo ID (Role-based)
   */
  async getCampaignById(
    campaignId: string,
    role: string,
    userId: string
  ): Promise<IVaccinationCampaign | null> {
    const campaign = await this.campaignRepo.getCampaignByIdWithRoleFilter(
      campaignId,
      role,
      userId
    );

    if (!campaign) {
      throw new ApplicationError("Campaign not found or access denied");
    }

    return campaign;
  }

  /**
   * 5. Thêm học sinh vào chiến dịch (Admin only)
   */
  async addStudentsToCampaign(
    campaignId: string,
    studentIds: string[],
    adminId: string
  ): Promise<void> {
    // Kiểm tra campaign tồn tại
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign) {
      throw new ApplicationError("Campaign not found");
    }

    // Kiểm tra campaign status (chỉ thêm được khi planned)
    if (campaign.status !== "planned") {
      throw new ApplicationError("Can only add students to planned campaigns");
    }

    try {
      await this.participationRepo.addStudentsToCampaign(
        campaignId,
        studentIds,
        adminId
      );
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ApplicationError("Some students are already added to this campaign");
      }
      throw error;
    }
  }

  /**
   * 6. Phụ huynh đồng ý/từ chối (Parent only)
   */
  async updateParentConsent(
    participationId: string,
    parentId: string,
    consent: 'approved' | 'denied',
    note?: string
  ): Promise<IVaccinationParticipation | null> {
    return this.participationRepo.updateParentConsent(
      participationId,
      parentId,
      consent,
      note
    );
  }
  /**
   * 7. Ghi nhận tiêm chủng (Nurse only)
   */
  async recordVaccination(
    participationId: string,
    nurseId: string,
    status: 'completed' | 'missed' | 'cancelled',
    note?: string
  ): Promise<IVaccinationParticipation | null> {
    // Kiểm tra participation tồn tại và đã được approve
    const participation = await this.participationRepo.findById(participationId);
    if (!participation) {
      throw new ApplicationError("Participation record not found");
    }

    if (participation.parentConsent !== "approved") {
      throw new ApplicationError("Parent consent is required before vaccination");
    }

    if (participation.vaccinationStatus === "completed") {
      throw new ApplicationError("This student has already been vaccinated");
    }

    return this.participationRepo.recordVaccination(
      participationId,
      nurseId,
      status,
      note
    );
  }

  /**
   * Get participations by campaign (for admin/nurse to see list)
   */
  async getParticipationsByCampaign(
    campaignId: string,
    options: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    return this.participationRepo.getParticipationsByCampaign(
      campaignId,
      options,
      sort
    );
  }

  /**
   * Get participations by parent (for parent to see their children)
   */
  async getParticipationsByParent(
    parentId: string,
    options: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    return this.participationRepo.getParticipationsByParent(
      parentId,
      options,
      sort
    );
  }

  /**
   * Get students with pending consent (for admin to track)
   */
  async getStudentsWithPendingConsent(
    campaignId: string,
    options: PaginationOptions
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    return this.participationRepo.getStudentsWithPendingConsent(
      campaignId,
      options
    );
  }

  /**
   * Get approved students ready for vaccination (for nurse)
   */
  async getApprovedStudentsForVaccination(
    campaignId: string,
    options: PaginationOptions
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    return this.participationRepo.getApprovedStudentsForVaccination(
      campaignId,
      options
    );
  }

  /**
   * Update campaign status (Admin only)
   */
  async updateCampaignStatus(
    campaignId: string,
    status: string,
    adminId: string
  ): Promise<IVaccinationCampaign | null> {
    return this.campaignRepo.updateCampaign(
      campaignId,
      { status } as Partial<IVaccinationCampaign>,
      adminId
    );
  }

  /**
   * Get campaign participations with filters
   */
  async getCampaignParticipations(
    campaignId: string,
    role: string,
    userId: string,
    filters: { parentConsent?: string; vaccinationStatus?: string; },
    options: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    // Role-based access control
    if (role === "nurse") {
      const campaign = await this.campaignRepo.getCampaignByIdWithRoleFilter(
        campaignId,
        role,
        userId
      );
      if (!campaign) {
        throw new ApplicationError("Campaign not found or access denied");
      }
    }

    return this.participationRepo.getParticipationsByCampaignWithFilters(
      campaignId,
      filters,
      options,
      sort
    );
  }

  /**
   * Parent consent method
   */
  async parentConsent(
    participationId: string,
    consent: 'approved' | 'denied',
    note: string | undefined,
    parentId: string
  ): Promise<IVaccinationParticipation | null> {
    return this.updateParentConsent(participationId, parentId, consent, note);
  }

  /**
   * Get parent participations
   */
  async getParentParticipations(
    parentId: string,
    filters: { parentConsent?: string; vaccinationStatus?: string; },
    options: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    return this.participationRepo.getParticipationsByParentWithFilters(
      parentId,
      filters,
      options,
      sort
    );
  }

  /**
   * Search campaigns with advanced filters
   */
  async searchCampaigns(
    role: string,
    userId: string,
    queryBuilder: VaccinationCampaignQueryBuilder
  ): Promise<PaginationResult<IVaccinationCampaign>> {
    return this.campaignRepo.searchCampaigns(role, userId, queryBuilder);
  }

  /**
   * Search participations with advanced filters
   */
  async searchParticipations(
    queryBuilder: VaccinationParticipationQueryBuilder
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    return this.participationRepo.searchParticipations(queryBuilder);
  }

  /**
   * Search parent participations with advanced filters
   */
  async searchParentParticipations(
    parentId: string,
    queryBuilder: VaccinationParticipationQueryBuilder
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    return this.participationRepo.searchParticipationsByParent(parentId, queryBuilder);
  }
}

const vaccinationService = new VaccinationService();
export default vaccinationService;
