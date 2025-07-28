import * as cron from 'node-cron';
import { VaccinationCampaign } from '@src/models/VaccinationCampaign';
import { VaccinationParticipation } from '@src/models/VaccinationParticipation';
import logger from 'jet-logger';

/**
 * Service quản lý tự động cập nhật trạng thái các chiến dịch tiêm chủng
 * 
 * Chức năng chính:
 * - Tự động chuyển campaign từ "planned" -> "ongoing" khi đến ngày bắt đầu
 * - Tự động chuyển campaign từ "ongoing" -> "completed" khi đến ngày kết thúc
 * - Cập nhật trạng thái các participation khi campaign kết thúc
 * - Cung cấp API để quản lý scheduler (start/stop/status)
 */
class CampaignSchedulerService {
  // =============================================================================
  // PROPERTIES - Thuộc tính của class
  // =============================================================================

  /** Cron job chạy hàng ngày để cập nhật trạng thái campaign */
  private dailyJob: cron.ScheduledTask | null = null;

  /** Trạng thái hiện tại của scheduler (đang chạy hay không) */
  private schedulerRunning: boolean = false;

  // =============================================================================
  // SCHEDULER MANAGEMENT - Quản lý lifecycle của scheduler
  // =============================================================================

  /**
   * Khởi động scheduler để tự động cập nhật trạng thái campaign
   * 
   * Hoạt động:
   * - Tạo cron job chạy hàng ngày lúc 00:01 (timezone Asia/Ho_Chi_Minh)
   * - Chạy ngay lần đầu khi khởi động để check trạng thái hiện tại
   * - Đánh dấu scheduler đang chạy
   */
  startScheduler(): void {
    // Kiểm tra xem scheduler đã chạy chưa
    if (this.schedulerRunning) {
      logger.info('Campaign scheduler is already running');
      return;
    }

    // Tạo cron job chạy mỗi ngày lúc 00:01 (1 phút sau nửa đêm)
    this.dailyJob = cron.schedule('1 0 * * *', async () => {
      await this.updateCampaignStatuses();
    }, {
      timezone: "Asia/Ho_Chi_Minh"
    });

    // Chạy ngay khi khởi động để check trạng thái hiện tại
    this.updateCampaignStatuses();

    // Đánh dấu scheduler đang chạy
    this.schedulerRunning = true;
    logger.info('Campaign scheduler started successfully');
  }

  /**
   * Dừng scheduler và cleanup resources
   * 
   * Hoạt động:
   * - Dừng cron job
   * - Reset trạng thái scheduler
   * - Log việc dừng scheduler
   */
  stopScheduler(): void {
    if (this.dailyJob) {
      this.dailyJob.stop();
      this.schedulerRunning = false;
      logger.info('Campaign scheduler stopped');
    }
  }

  // =============================================================================
  // CORE BUSINESS LOGIC - Logic nghiệp vụ chính
  // =============================================================================

  /**
   * Logic chính để cập nhật trạng thái campaigns theo lịch trình
   * 
   * Quy trình:
   * 1. Lấy ngày hiện tại (reset về đầu ngày để so sánh chính xác)
   * 2. Tìm và cập nhật campaigns cần chuyển từ "planned" -> "ongoing"
   * 3. Tìm và cập nhật campaigns cần chuyển từ "ongoing" -> "completed"
   * 4. Log kết quả chi tiết
   * 
   * @returns Promise<void>
   */
  async updateCampaignStatuses(): Promise<void> {
    try {
      logger.info('Starting campaign status update job...');

      // Lấy ngày hiện tại và reset về đầu ngày (00:00:00.000)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      logger.info(`Current date for comparison: ${today.toISOString()}`);

      // BƯỚC 1: Xử lý campaigns cần chuyển từ "planned" sang "ongoing"
      await this.processPlannedToOngoingCampaigns(today);

      // BƯỚC 2: Xử lý campaigns cần chuyển từ "ongoing" sang "completed"  
      await this.processOngoingToCompletedCampaigns(today);

      logger.info('Campaign status update completed successfully');

    } catch (error) {
      logger.err('Error updating campaign statuses:', error);
    }
  }

  /**
   * Xử lý các campaign cần chuyển từ "planned" sang "ongoing"
   * 
   * Điều kiện: startDate <= today
   * 
   * @param today - Ngày hiện tại (đã reset về đầu ngày)
   */
  private async processPlannedToOngoingCampaigns(today: Date): Promise<void> {
    // Tìm các campaign đủ điều kiện để bắt đầu
    const campaignsToStart = await VaccinationCampaign.find({
      status: 'planned',
      startDate: { $lte: today }
    });

    logger.info(`Found ${campaignsToStart.length} campaigns to start`);

    // Log chi tiết từng campaign
    campaignsToStart.forEach(campaign => {
      logger.info(`- Campaign "${campaign.vaccineName}" (Start: ${campaign.startDate.toISOString()})`);
    });

    // Cập nhật từng campaign
    let startedCount = 0;
    for (const campaign of campaignsToStart) {
      const success = await this.updateCampaignToOngoing(campaign);
      if (success) startedCount++;
    }

    logger.info(`Successfully started ${startedCount}/${campaignsToStart.length} campaigns`);
  }

  /**
   * Xử lý các campaign cần chuyển từ "ongoing" sang "completed"
   * 
   * Điều kiện: endDate < today (campaign đã qua ngày kết thúc)
   * 
   * @param today - Ngày hiện tại (đã reset về đầu ngày)
   */
  private async processOngoingToCompletedCampaigns(today: Date): Promise<void> {
    // Tìm các campaign đã hết hạn
    const campaignsToComplete = await VaccinationCampaign.find({
      status: 'ongoing',
      endDate: { $lt: today }
    });

    logger.info(`Found ${campaignsToComplete.length} campaigns to complete`);

    // Log chi tiết từng campaign
    campaignsToComplete.forEach(campaign => {
      logger.info(`- Campaign "${campaign.vaccineName}" (End: ${campaign.endDate.toISOString()})`);
    });

    // Cập nhật từng campaign
    let completedCount = 0;
    for (const campaign of campaignsToComplete) {
      const success = await this.updateCampaignToCompleted(campaign);
      if (success) completedCount++;
    }

    logger.info(`Successfully completed ${completedCount}/${campaignsToComplete.length} campaigns`);
  }

  // =============================================================================
  // CAMPAIGN STATUS UPDATES - Cập nhật trạng thái campaign cụ thể
  // =============================================================================

  /**
   * Cập nhật một campaign từ trạng thái "planned" sang "ongoing"
   * 
   * Hoạt động:
   * - Cập nhật status của campaign trong database
   * - Không cần cập nhật participation vì chúng đã ở trạng thái 'scheduled' 
   *   khi được tạo với parentConsent: 'approved'
   * 
   * @param campaign - Campaign object cần cập nhật
   * @returns Promise<boolean> - true nếu thành công, false nếu có lỗi
   */
  private async updateCampaignToOngoing(campaign: any): Promise<boolean> {
    try {
      // Cập nhật status của campaign
      await VaccinationCampaign.updateOne(
        { _id: campaign._id },
        { status: 'ongoing' }
      );

      logger.info(`Campaign "${campaign.vaccineName}" (ID: ${campaign._id}) updated to ongoing status`);
      return true;

    } catch (error) {
      logger.err(`Error updating campaign ${campaign._id} to ongoing:`, error);
      return false;
    }
  }

  /**
   * Cập nhật một campaign từ trạng thái "ongoing" sang "completed"
   * 
   * Hoạt động:
   * 1. Cập nhật status của campaign trong database
   * 2. Xử lý các participation chưa hoàn thành:
   *    - Participation có consent = 'approved' nhưng chưa tiêm -> 'missed'
   *    - Participation có consent = 'pending' -> 'canceled'
   * 
   * @param campaign - Campaign object cần cập nhật
   * @returns Promise<boolean> - true nếu thành công, false nếu có lỗi
   */
  private async updateCampaignToCompleted(campaign: any): Promise<boolean> {
    try {
      // BƯỚC 1: Cập nhật status của campaign
      await VaccinationCampaign.updateOne(
        { _id: campaign._id },
        { status: 'completed' }
      );

      // BƯỚC 2: Xử lý participations chưa hoàn thành thành "missed"
      // (Đã có consent nhưng chưa tiêm)
      const missedUpdateResult = await VaccinationParticipation.updateMany(
        {
          campaign: campaign._id,
          vaccinationStatus: { $in: ['scheduled'] },
          parentConsent: 'approved'
        },
        {
          vaccinationStatus: 'missed',
          nurseNote: 'Auto-marked as missed due to campaign completion'
        }
      );

      // BƯỚC 3: Xử lý participations chưa có consent thành "canceled"
      // (Chưa có consent từ phụ huynh)
      const canceledUpdateResult = await VaccinationParticipation.updateMany(
        {
          campaign: campaign._id,
          parentConsent: 'pending'
        },
        {
          parentConsent: 'canceled',
          vaccinationStatus: 'canceled',
          nurseNote: 'Auto-canceled due to campaign completion without parent consent'
        }
      );

      logger.info(
        `Campaign "${campaign.vaccineName}" (ID: ${campaign._id}) completed. ` +
        `${missedUpdateResult.modifiedCount} marked as missed, ` +
        `${canceledUpdateResult.modifiedCount} canceled`
      );

      return true;

    } catch (error) {
      logger.err(`Error updating campaign ${campaign._id} to completed:`, error);
      return false;
    }
  }

  // =============================================================================
  // PUBLIC API METHODS - Các method public cho API endpoints
  // =============================================================================

  /**
   * Thực hiện cập nhật trạng thái campaign thủ công (Manual Update)
   * 
   * Được sử dụng bởi API endpoint để cho phép admin cập nhật trạng thái
   * campaigns ngay lập tức mà không cần chờ đến lịch trình tự động.
   * 
   * Quy trình:
   * 1. Query để đếm số campaign cần được cập nhật
   * 2. Chạy logic cập nhật chính
   * 3. Trả về thống kê kết quả
   * 
   * @returns Promise<{started: number, completed: number}> - Số lượng campaigns đã được cập nhật
   */
  async manualUpdate(): Promise<{ started: number; completed: number; }> {
    logger.info('Running manual campaign status update...');

    // Chuẩn bị ngày hiện tại để so sánh
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Query để đếm số campaigns sẽ được cập nhật (cho thống kê)
    const campaignsToStart = await VaccinationCampaign.find({
      status: 'planned',
      startDate: { $lte: today }
    });

    const campaignsToComplete = await VaccinationCampaign.find({
      status: 'ongoing',
      endDate: { $lt: today }
    });

    // Thực hiện cập nhật
    await this.updateCampaignStatuses();

    // Trả về kết quả thống kê
    return {
      started: campaignsToStart.length,
      completed: campaignsToComplete.length
    };
  }

  // =============================================================================
  // SCHEDULER STATUS & INFO - Thông tin và trạng thái scheduler
  // =============================================================================

  /**
   * Kiểm tra xem scheduler có đang chạy không
   * 
   * Được sử dụng bởi API endpoint để cung cấp thông tin trạng thái
   * cho admin hoặc monitoring system.
   * 
   * @returns boolean - true nếu scheduler đang chạy, false nếu đã dừng
   */
  isRunning(): boolean {
    return this.schedulerRunning;
  }

  /**
   * Tính toán thời gian chạy tiếp theo của scheduler
   * 
   * Được sử dụng bởi API endpoint để hiển thị thông tin về lần chạy
   * tiếp theo cho admin.
   * 
   * Logic: Scheduler chạy hàng ngày lúc 00:01, vậy thời gian tiếp theo
   * sẽ là 00:01 của ngày hôm sau.
   * 
   * @returns Date|null - Thời gian chạy tiếp theo, hoặc null nếu scheduler không chạy
   */
  getNextRunTime(): Date | null {
    if (this.dailyJob && this.schedulerRunning) {
      // Tính toán thời gian chạy tiếp theo (00:01 ngày mai)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 1, 0, 0); // 00:01:00.000
      return tomorrow;
    }
    return null;
  }
}

// =============================================================================
// SINGLETON EXPORT - Export instance duy nhất
// =============================================================================

/**
 * Export singleton instance của CampaignSchedulerService
 * 
 * Lý do sử dụng singleton:
 * - Đảm bảo chỉ có 1 scheduler chạy trong toàn bộ application
 * - Tránh việc tạo multiple cron jobs cùng lúc
 * - Dễ dàng quản lý state và lifecycle của scheduler
 * 
 * Cách sử dụng:
 * import campaignSchedulerService from '@src/services/CampaignSchedulerService';
 * campaignSchedulerService.startScheduler();
 */
const campaignSchedulerService = new CampaignSchedulerService();
export default campaignSchedulerService;
