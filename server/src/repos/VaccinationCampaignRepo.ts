import { BaseRepository } from "@src/common/base/base.repository";
import { FilterOptions, PaginationOptions, PaginationResult, SortOptions } from "@src/common/interfaces/mongo.interface";
import { Role } from "@src/models/Role";
import { User } from "@src/models/User";
import { VaccinationCampaign, IVaccinationCampaign } from "@src/models/VaccinationCampaign";
import { VaccinationCampaignQueryBuilder } from "@src/payload/request/filter/vaccination.request";
import { Types } from "mongoose";

export class VaccinationCampaignRepository extends BaseRepository<IVaccinationCampaign> {
  constructor() {
    super(VaccinationCampaign);
  }
  /**
   * Get campaigns with role-based filtering
   * Chức năng: Lấy danh sách chiến dịch tiêm chủng với phân quyền
   * - Admin có thể xem tất cả chiến dịch
   * - Nurse chỉ xem các chiến dịch có trạng thái "planned" hoặc "ongoing
   * @param role - Role của người dùng (nurse hoặc admin)
   * @param userId - ID của người dùng hiện tại (để kiểm tra quyền)
   * @param options - Pagination options (page, limit)  
   * @param sort - Sort options (nếu có)
   * @returns Paginated result với danh sách chiến dịch
   * Security:
   * - Chỉ expose các trường cần thiết (ẩn password)
   * - Role-based access control: Nurse chỉ xem các chiến dịch phù hợp với quyền của họ
   * * Performance:
   * - Sử dụng compound indexes để tối ưu truy vấn  
   */
  async getCampaignsWithRoleFilter(
    role: string,
    userId: string,
    options: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<IVaccinationCampaign>> {
    let filter: FilterOptions<IVaccinationCampaign> = {};

    const user = await User.findById(userId).exec() as any;
    const validRole = await Role.findOne({ name: role }).exec() as any;

    if (role === "nurse" && user?.roleId === validRole._id.toString()) {
      // Nurse chỉ xem campaigns planned và ongoing
      filter.status = { $in: ["planned", "ongoing"] };
    }
    // Admin xem tất cả (không filter gì thêm)

    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.model
        .find(filter)
        .populate('createdBy', 'name email') // Ẩn password
        .sort(sort || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return {
      records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get campaign by ID with role-based access
   * Chức năng: Lấy thông tin chi tiết của một chiến dịch tiêm chủng theo ID
   * - Admin có thể xem tất cả chiến dịch
   * - Nurse chỉ xem các chiến dịch có trạng thái "planned" hoặc "ongoing"
   * @param campaignId - ID của chiến dịch cần lấy
   * @param role - Role của người dùng (nurse hoặc admin)
   * @param userId - ID của người dùng hiện tại (để kiểm tra quyền
   * @return IVaccinationCampaign | null - Trả về chiến dịch nếu tìm thấy, ngược lại null
   * Security:
   * - Chỉ expose các trường cần thiết (ẩn password)
   * - Role-based access control: Nurse chỉ xem các chiến dịch phù hợp với quyền của họ
   * Performance:
   * - Sử dụng compound indexes để tối ưu truy vấn
   * @throws Error nếu không tìm thấy chiến dịch hoặc không có quyền truy cập
   */
  async getCampaignByIdWithRoleFilter(
    campaignId: string,
    role: string,
    userId: string
  ): Promise<IVaccinationCampaign | null> {
    let filter: FilterOptions<IVaccinationCampaign> = {
      _id: new Types.ObjectId(campaignId)
    };
    const user = await User.findById(userId).exec() as any;
    const validRole = await Role.findOne({ name: role }).exec() as any;

    if (role === "nurse" && user?.roleId === validRole._id.toString()) {
      // Nurse chỉ xem campaigns planned và ongoing
      filter.status = { $in: ["planned", "ongoing"] };
    }

    return this.model.findOne(filter)
      .populate('createdBy', 'name email') // Ẩn password
      .exec();
  }

  /**
   * Update campaign (chỉ admin được phép)
   * Chức năng: Cập nhật thông tin chiến dịch tiêm chủng
   * - Chỉ admin tạo mới có thể sửa chiến dịch
   * @param campaignId - ID của chiến dịch cần cập nhật
   * @param updateData - Dữ liệu cập nhật (partial)
   * @param adminId - ID của admin thực hiện cập nhật
   * @returns IVaccinationCampaign | null - Trả về chiến dịch đã cập nhật
   * Security:
   * - Chỉ admin tạo mới có thể sửa chiến dịch
   * Performance:
   * - Sử dụng compound indexes để tối ưu truy vấn
   */
  async updateCampaign(
    campaignId: string,
    updateData: Partial<IVaccinationCampaign>,
    adminId: string
  ): Promise<IVaccinationCampaign | null> {
    // Kiểm tra quyền: chỉ admin tạo mới có thể sửa
    const campaign = await this.findById(campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    if (campaign.createdBy.toString() !== adminId) {
      throw new Error("Only the creator can update this campaign");
    }

    return this.update(campaignId, updateData);
  }
  /**
   * Get campaigns by status
   * Chức năng: Lấy danh sách chiến dịch theo trạng thái
   * - Dùng để lọc các chiến dịch theo trạng thái cụ thể (planned, ongoing, completed, cancelled)
   * @param status - Mảng các trạng thái cần lọc
   * @param options - Pagination options (page, limit)
   * @param sort - Sort options (nếu có)  
   * @returns PaginationResult<IVaccinationCampaign> - Trả về danh sách chiến dịch theo trạng thái
   * Security:
   * - Chỉ expose các trường cần thiết (ẩn password)
   * Performance:
   * - Sử dụng compound indexes để tối ưu truy vấn
   * - Sử dụng skip và limit để phân trang hiệu quả
   */
  async getCampaignsByStatus(
    status: string[],
    options: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<IVaccinationCampaign>> {
    const filter: FilterOptions<IVaccinationCampaign> = {
      status: { $in: status }
    };

    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.model
        .find(filter)
        .populate('createdBy', 'name email') // Ẩn password
        .sort(sort || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return {
      records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 🔍 MAIN SEARCH METHOD - Smart Query Routing with Role-Based Access
   * 
   * Chức năng: Entry point cho campaign search với role-based security
   * 
   * Tối ưu hóa:
   * - Strategy pattern: Chọn method phù hợp dựa trên keyword presence
   * - Role-based filtering: Nurse chỉ xem planned/ongoing campaigns
   * - Index optimization: Sử dụng compound indexes để tăng performance
   * 
   * Security:
   * - Role-based access control (nurse vs admin)
   * - Populate chỉ safe fields, ẩn password
   * 
   * @param role - User role ('nurse' hoặc 'admin')
   * @param userId - ID của user hiện tại
   * @param queryBuilder - Object chứa search parameters
   * @returns Paginated campaign results
   * @throws Error nếu không tìm thấy chiến dịch hoặc không có quyền truy cập
   */
  async searchCampaigns(
    role: string,
    userId: string,
    queryBuilder: VaccinationCampaignQueryBuilder
  ): Promise<PaginationResult<IVaccinationCampaign>> {
    // 🚀 PERFORMANCE OPTIMIZATION: Smart routing dựa trên keyword presence
    if (queryBuilder.getKeyword()) {
      // Strategy 1: Aggregation Pipeline cho keyword search
      // - Pros: Có thể search trong related collections (users)
      // - Cons: Phức tạp hơn, tốn resources hơn
      return this.searchCampaignsWithKeyword(role, userId, queryBuilder);
    }

    // Strategy 2: Simple MongoDB Query cho basic filtering
    // - Pros: Performance cao, sử dụng indexes efficiently
    // - Cons: Chỉ search trong current collection
    return this.searchCampaignsWithSimpleFilter(role, userId, queryBuilder);
  }

  /**
   * 🔧 SIMPLE FILTER SEARCH - High Performance Strategy
   * 
   * Chức năng: Search campaigns với MongoDB query đơn giản
   * 
   * Tối ưu hóa:
   * - Sử dụng compound indexes: (status + createdAt), (startDate + status)
   * - Role-based early filtering để giảm data scan
   * - Populate selective để giảm data transfer
   * 
   * @param role - User role
   * @param userId - User ID
   * @param queryBuilder - Query parameters không có keyword
   * @returns Paginated results
   */
  private async searchCampaignsWithSimpleFilter(
    role: string,
    userId: string,
    queryBuilder: VaccinationCampaignQueryBuilder
  ): Promise<PaginationResult<IVaccinationCampaign>> {
    // Build filter từ query parameters
    let filter = queryBuilder.buildFilter();
    const user = await User.findById(userId).exec() as any;
    const validRole = await Role.findOne({ name: role }).exec() as any;

    if (role === "nurse" && user?.roleId === validRole._id.toString()) {
      // Nurse chỉ xem campaigns planned và ongoing
      if (filter.status) {
        // Nếu đã có filter status, validate với nurse permissions
        const allowedStatuses = ["planned", "ongoing"];
        if (!allowedStatuses.includes(filter.status as string)) {
          // Status không được phép, return empty result
          return {
            records: [],
            total: 0,
            page: queryBuilder.getPage(),
            limit: queryBuilder.getLimit(),
            totalPages: 0
          };
        }
      } else {
        // Không có filter status, thêm nurse restriction
        filter.status = { $in: ["planned", "ongoing"] };
      }
    }
    // Admin không có restriction gì

    // 📊 PARALLEL EXECUTION: Chạy đồng thời query + count để tối ưu response time
    const [records, total] = await Promise.all([
      // Main query với optimized indexes và selective population
      this.model.find(filter)
        // 🔗 SELECTIVE POPULATE: Chỉ lấy fields cần thiết, ẩn sensitive data
        .populate('createdBy', 'name email') // Creator info (NO password)
        // 📄 PAGINATION: Skip và limit cho phân trang
        .skip(queryBuilder.getSkip())
        .limit(queryBuilder.getLimit())
        // 📈 SORTING: Sử dụng index để sort efficiently
        .sort(queryBuilder.getSort())
        .exec(),

      // Count query để tính total pages
      this.model.countDocuments(filter).exec()
    ]);

    return {
      records,
      total,
      page: queryBuilder.getPage(),
      limit: queryBuilder.getLimit(),
      totalPages: Math.ceil(total / queryBuilder.getLimit())
    };
  }

  /**
   * 🔍 AGGREGATION PIPELINE SEARCH - Advanced Multi-Collection Search
   * 
   * Chức năng: Search campaigns với keyword across multiple fields và related collections
   * 
   * Tối ưu hóa:
   * - Sử dụng $lookup để join với users collection (creators)
   * - $addFields để tính relevance score dựa trên keyword matching
   * - Early filtering với role-based access control
   * - Projection để hide sensitive fields và tối ưu data transfer
   * 
   * Scoring Algorithm:
   * - Campaign fields match (vaccineName, vaccineType, targetAudience): 10 points
   * - Creator info match (name, email): 5 points
   * - Sort by total score desc, sau đó theo user criteria
   * 
   * Pipeline stages:
   * 1. $lookup: Join với users collection để lấy creator info
   * 2. $match: Filter theo basic criteria + role-based access
   * 3. $addFields: Tính relevance scores cho keyword matching
   * 4. $match: Lọc chỉ những records có score > 0
   * 5. $addFields: Tính totalScore để sort
   * 6. $project: Format output và hide sensitive fields
   * 7. $sort: Sort theo relevance + user criteria
   * 8. $skip/$limit: Pagination
   * 
   * @param role - User role for access control
   * @param userId - User ID (for future extensions)
   * @param queryBuilder - Query parameters có keyword
   * @returns Paginated results với relevance scoring
   */
  private async searchCampaignsWithKeyword(
    role: string,
    userId: string,
    queryBuilder: VaccinationCampaignQueryBuilder
  ): Promise<PaginationResult<IVaccinationCampaign>> {
    // Build filter conditions từ query parameters
    const filter = queryBuilder.buildFilter();
    const keyword = queryBuilder.getKeyword()!; // Keyword chắc chắn có vì đã check ở đầu method
    const user = await User.findById(userId).exec() as any;
    const validRole = await Role.findOne({ name: role }).exec() as any;

    if (role === "nurse" && user?.roleId === validRole._id.toString()) {
      filter.status = { $in: ["planned", "ongoing"] };
    }

    // 🔄 AGGREGATION PIPELINE: Multi-stage processing cho complex search
    const pipeline = [
      // 🔗 STAGE 1: JOIN WITH USERS COLLECTION
      // Mục đích: Lấy thông tin creator để search trong name, email
      {
        $lookup: {
          from: 'users', // Collection name trong MongoDB
          localField: 'createdBy', // Field trong VaccinationCampaign
          foreignField: '_id', // Field trong Users
          as: 'createdByInfo' // Alias cho joined data
        }
      },

      // 🎯 STAGE 2: BASIC FILTERING
      // Mục đích: Apply basic filters (status, dates, etc.) trước khi text search
      // Optimization: Filter sớm để giảm data cần process
      {
        $match: filter
      },

      // 🔢 STAGE 3: RELEVANCE SCORING
      // Mục đích: Tính điểm relevance dựa trên keyword matching
      {
        $addFields: {
          // 📝 CAMPAIGN TEXT SCORE: Search trong vaccine name, type, target audience
          textScore: {
            $cond: {
              if: {
                $regexMatch: {
                  input: { $concat: ['$vaccineName', ' ', '$vaccineType', ' ', '$targetAudience'] },
                  regex: keyword,
                  options: 'i' // Case-insensitive
                }
              },
              then: 10, // Điểm cao cho campaign fields
              else: 0
            }
          },
          // 👤 CREATOR SCORE: Search trong creator name và email
          creatorScore: {
            $cond: {
              if: {
                $or: [
                  { $regexMatch: { input: { $arrayElemAt: ['$createdByInfo.name', 0] }, regex: keyword, options: 'i' } },
                  { $regexMatch: { input: { $arrayElemAt: ['$createdByInfo.email', 0] }, regex: keyword, options: 'i' } }
                ]
              },
              then: 5, // Điểm thấp hơn cho creator fields
              else: 0
            }
          }
        }
      },

      // 🎯 STAGE 4: RELEVANCE FILTERING
      // Mục đích: Chỉ giữ lại những records có keyword match (score > 0)
      {
        $match: {
          $expr: { $gt: [{ $add: ['$textScore', '$creatorScore'] }, 0] }
        }
      },

      // 🔢 STAGE 5: TOTAL SCORE CALCULATION
      // Mục đích: Tính tổng điểm để sort theo relevance
      {
        $addFields: {
          totalScore: { $add: ['$textScore', '$creatorScore'] }
        }
      },

      // 🔒 STAGE 6: PROJECTION & SECURITY
      // Mục đích: Format output và hide sensitive information (passwords)
      {
        $project: {
          _id: 1,
          vaccineName: 1,
          vaccineType: 1,
          targetAudience: 1,
          startDate: 1,
          status: 1,
          // 🔒 SECURE USER INFO: Chỉ expose safe fields
          createdBy: {
            _id: { $arrayElemAt: ['$createdByInfo._id', 0] },
            name: { $arrayElemAt: ['$createdByInfo.name', 0] },
            email: { $arrayElemAt: ['$createdByInfo.email', 0] }
            // ❌ Password và sensitive fields được ẩn
          },
          createdAt: 1,
          updatedAt: 1,
          totalScore: 1 // Giữ score để sort
        }
      }
    ];

    // 📊 PARALLEL EXECUTION: Chạy đồng thời data query + count query
    const [records, totalResult] = await Promise.all([
      // Main aggregation với sorting và pagination
      VaccinationCampaign.aggregate([
        ...pipeline,
        // 📈 SORTING: Sort theo relevance score trước, sau đó theo user criteria
        { $sort: { totalScore: -1, ...queryBuilder.getSort() } },
        // 📄 PAGINATION: Skip và limit
        { $skip: queryBuilder.getSkip() },
        { $limit: queryBuilder.getLimit() }
      ]).exec(),

      // Count aggregation để tính total records
      VaccinationCampaign.aggregate([
        ...pipeline,
        { $count: "total" } // Đếm số documents sau khi filter
      ]).exec()
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      records,
      total,
      page: queryBuilder.getPage(),
      limit: queryBuilder.getLimit(),
      totalPages: Math.ceil(total / queryBuilder.getLimit())
    };
  }
}
