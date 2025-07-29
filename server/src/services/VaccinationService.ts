import { ApplicationError } from "@src/common/util/util.route-errors";
import { PaginationOptions, PaginationResult, SortOptions } from "@src/common/interfaces/mongo.interface";
import { VaccinationCampaignRepository } from "@src/repos/VaccinationCampaignRepo";
import { VaccinationParticipationRepository } from "@src/repos/VaccinationParticipationRepo";
import { IVaccinationCampaign } from "@src/models/VaccinationCampaign";
import { IVaccinationParticipation } from "@src/models/VaccinationParticipation";
import { Types } from "mongoose";
import { VaccinationCampaignQueryBuilder, VaccinationParticipationQueryBuilder } from "@src/payload/request/filter/vaccination.request";
import { Dayjs } from "dayjs";

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
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign) {
      throw new ApplicationError("Không tìm thấy chiến dịch tiêm chủng");
    }

    // Business rules for status updates
    if (updateData.status) {
      const currentDate = new Date();
      const campaignStartDate = new Date(campaign.startDate);
      const campaignEndDate = new Date(campaign.endDate);

      // Rule 1: Cannot set status to "ongoing" if campaign hasn't started yet
      if (updateData.status === 'ongoing' && currentDate < campaignStartDate) {
        throw new ApplicationError(
          `Không thể đặt trạng thái chiến dịch thành "đang diễn ra" vì chiến dịch chưa bắt đầu. Ngày bắt đầu chiến dịch: ${campaignStartDate.toLocaleDateString()}`
        );
      }

      // Rule 2: Cannot set status to "completed" if campaign hasn't ended yet
      if (updateData.status === 'completed' && currentDate < campaignEndDate) {
        throw new ApplicationError(
          `Không thể đặt trạng thái chiến dịch thành "hoàn thành" vì chiến dịch chưa kết thúc. Ngày kết thúc chiến dịch: ${campaignEndDate.toLocaleDateString()}`
        );
      }
    }

    await this.campaignRepo.updateCampaign(campaignId, updateData, adminId);
    if (updateData.status === 'completed' || updateData.status === 'canceled') {
      await this.participationRepo.cancelPendingParticipations(campaignId);
    }
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
      throw new ApplicationError("Không tìm thấy chiến dịch tiêm chủng hoặc bị từ chối truy cập");
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
      throw new ApplicationError("Không tìm thấy chiến dịch tiêm chủng");
    }

    // Kiểm tra campaign status (chỉ thêm được khi planned)
    if (campaign.status !== "planned") {
      throw new ApplicationError("Chỉ có thể thêm học sinh vào các chiến dịch đang trong trạng thái lên kế hoạch");
    }

    // Kiểm tra học sinh trùng lặp trong danh sách được gửi lên
    const uniqueStudentIds = Array.from(new Set(studentIds));
    if (uniqueStudentIds.length !== studentIds.length) {
      throw new ApplicationError("Danh sách học sinh có ID trùng lặp, vui lòng kiểm tra lại");
    }

    // Kiểm tra học sinh đã tồn tại trong chiến dịch
    const existingParticipations = await this.participationRepo.findByCampaignAndStudents(
      campaignId,
      uniqueStudentIds
    );

    if (existingParticipations.length > 0) {
      const existingStudentIds = existingParticipations.map((p: any) => p.student.toString());
      const duplicateStudentIds = uniqueStudentIds.filter(id => existingStudentIds.includes(id));

      throw new ApplicationError(
        `Các học sinh sau đã được thêm vào chiến dịch này rồi: ${duplicateStudentIds.join(', ')}`
      );
    }

    try {
      await this.participationRepo.addStudentsToCampaign(
        campaignId,
        uniqueStudentIds,
        adminId
      );
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ApplicationError("Một số học sinh đã được thêm vào chiến dịch này rồi");
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
  }  /**
   * 7. Ghi nhận tiêm chủng (Nurse only)
   */
  async recordVaccination(
    participationId: string,
    nurseId: string,
    status: 'completed' | 'missed' | 'canceled',
    vaccinationDate?: Date,
    note?: string
  ): Promise<IVaccinationParticipation | null> {
    // Kiểm tra participation tồn tại và đã được approve
    const participation = await this.participationRepo.findById(participationId);
    if (!participation) {
      throw new ApplicationError("Không tìm thấy bản ghi tham gia tiêm chủng");
    }

    if (participation.parentConsent !== "approved") {
      throw new ApplicationError("Cần có sự đồng ý của phụ huynh trước khi tiêm chủng");
    }

    if (participation.vaccinationStatus === "completed") {
      throw new ApplicationError("Học sinh này đã được tiêm chủng rồi");
    }

    return this.participationRepo.recordVaccination(
      participationId,
      nurseId,
      status,
      vaccinationDate,
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
        throw new ApplicationError("Không tìm thấy chiến dịch tiêm chủng hoặc bị từ chối truy cập");
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
