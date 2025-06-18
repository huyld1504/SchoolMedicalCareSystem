import { BaseRepository } from "@src/common/base/base.repository";
import { FilterOptions, PaginationOptions, PaginationResult, SortOptions } from "@src/common/interfaces/mongo.interface";
import { VaccinationCampaign, IVaccinationCampaign } from "@src/models/VaccinationCampaign";
import { VaccinationCampaignQueryBuilder } from "@src/payload/request/filter/vaccination.request";
import { Types } from "mongoose";

export class VaccinationCampaignRepository extends BaseRepository<IVaccinationCampaign> {
  constructor() {
    super(VaccinationCampaign);
  }
  /**
   * Get campaigns with role-based filtering
   */
  async getCampaignsWithRoleFilter(
    role: string,
    userId: string,
    options: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<IVaccinationCampaign>> {
    let filter: FilterOptions<IVaccinationCampaign> = {};

    if (role === "nurse") {
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
   */
  async getCampaignByIdWithRoleFilter(
    campaignId: string,
    role: string,
    userId: string
  ): Promise<IVaccinationCampaign | null> {
    let filter: FilterOptions<IVaccinationCampaign> = {
      _id: new Types.ObjectId(campaignId)
    };

    if (role === "nurse") {
      // Nurse chỉ xem campaigns planned và ongoing
      filter.status = { $in: ["planned", "ongoing"] };
    }

    return this.model.findOne(filter)
      .populate('createdBy', 'name email') // Ẩn password
      .exec();
  }

  /**
   * Update campaign (chỉ admin được phép)
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
   * Search campaigns with advanced filters using BaseQueryBuilder
   */
  async searchCampaigns(
    role: string,
    userId: string,
    queryBuilder: VaccinationCampaignQueryBuilder
  ): Promise<PaginationResult<IVaccinationCampaign>> {
    if (queryBuilder.getKeyword()) {
      // Nếu có keyword, sử dụng aggregation để search hiệu quả hơn
      return this.searchCampaignsWithKeyword(role, userId, queryBuilder);
    }

    // Nếu không có keyword, sử dụng simple filter
    let filter = queryBuilder.buildFilter();

    // Apply role-based filtering
    if (role === "nurse") {
      // Nurse chỉ xem campaigns planned và ongoing
      if (filter.status) {
        // Nếu đã có filter status, thì intersect với nurse permissions
        const allowedStatuses = ["planned", "ongoing"];
        if (allowedStatuses.includes(filter.status)) {
          // Status được phép, giữ nguyên
        } else {
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
    } const [records, total] = await Promise.all([
      this.model.find(filter)
        .populate('createdBy', 'name email') // Chỉ lấy name và email, ẩn password
        .skip(queryBuilder.getSkip())
        .limit(queryBuilder.getLimit())
        .sort(queryBuilder.getSort())
        .exec(),
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
   * Search campaigns with keyword using aggregation pipeline for better performance
   */
  private async searchCampaignsWithKeyword(
    role: string,
    userId: string,
    queryBuilder: VaccinationCampaignQueryBuilder
  ): Promise<PaginationResult<IVaccinationCampaign>> {
    const filter = queryBuilder.buildFilter();
    const keyword = queryBuilder.getKeyword()!;

    // Apply role-based filtering
    if (role === "nurse") {
      filter.status = { $in: ["planned", "ongoing"] };
    }

    const pipeline = [
      // Lookup creator info để có thể search trong creator name
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByInfo'
        }
      },
      // Match với filter trước
      {
        $match: filter
      },
      // Thêm score field cho text search và regex search
      {
        $addFields: {
          textScore: {
            $cond: {
              if: { $regexMatch: { input: { $concat: ['$vaccineName', ' ', '$vaccineType', ' ', '$targetAudience'] }, regex: keyword, options: 'i' } },
              then: 10,
              else: 0
            }
          },
          creatorScore: {
            $cond: {
              if: {
                $or: [
                  { $regexMatch: { input: { $arrayElemAt: ['$createdByInfo.name', 0] }, regex: keyword, options: 'i' } },
                  { $regexMatch: { input: { $arrayElemAt: ['$createdByInfo.email', 0] }, regex: keyword, options: 'i' } }
                ]
              },
              then: 5,
              else: 0
            }
          }
        }
      },
      // Filter để chỉ lấy những record có match
      {
        $match: {
          $expr: { $gt: [{ $add: ['$textScore', '$creatorScore'] }, 0] }
        }
      },
      // Sắp xếp theo score trước, sau đó theo sort criteria
      {
        $addFields: {
          totalScore: { $add: ['$textScore', '$creatorScore'] }
        }
      },      // Project để loại bỏ các field tạm thời và ẩn password
      {
        $project: {
          _id: 1,
          vaccineName: 1,
          vaccineType: 1,
          targetAudience: 1,
          startDate: 1,
          status: 1,
          createdBy: {
            _id: { $arrayElemAt: ['$createdByInfo._id', 0] },
            name: { $arrayElemAt: ['$createdByInfo.name', 0] },
            email: { $arrayElemAt: ['$createdByInfo.email', 0] }
            // Ẩn password và các field nhạy cảm khác
          },
          createdAt: 1,
          updatedAt: 1,
          totalScore: 1
        }
      }
    ];

    const [records, totalResult] = await Promise.all([
      VaccinationCampaign.aggregate([
        ...pipeline,
        { $sort: { totalScore: -1, ...queryBuilder.getSort() } },
        { $skip: queryBuilder.getSkip() },
        { $limit: queryBuilder.getLimit() }
      ]).exec(),

      VaccinationCampaign.aggregate([
        ...pipeline,
        { $count: "total" }
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
