import { BaseRepository } from "@src/common/base/base.repository";
import { FilterOptions, PaginationOptions, PaginationResult, SortOptions } from "@src/common/interfaces/mongo.interface";
import { VaccinationParticipation, IVaccinationParticipation } from "@src/models/VaccinationParticipation";
import { VaccinationParticipationQueryBuilder } from "@src/payload/request/filter/vaccination.request";
import { Types } from "mongoose";

export class VaccinationParticipationRepository extends BaseRepository<IVaccinationParticipation> {
  constructor() {
    super(VaccinationParticipation);
  }

  /**
   * Add students to campaign (bulk insert)
   */
  async addStudentsToCampaign(
    campaignId: string,
    studentIds: string[],
    adminId: string
  ): Promise<void> {
    const participations = studentIds.map(studentId => ({
      campaign: new Types.ObjectId(campaignId),
      student: new Types.ObjectId(studentId),
      parentConsent: "pending",
      vaccinationStatus: "scheduled",
      createdBy: new Types.ObjectId(adminId)
    }));

    await VaccinationParticipation.insertMany(participations);
  }

  /**
   * Get participations by campaign
   */
  async getParticipationsByCampaign(
    campaignId: string,
    options: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    const filter: FilterOptions<IVaccinationParticipation> = {
      campaign: new Types.ObjectId(campaignId)
    };

    return this.paginate(filter, options, sort);
  }

  /**
   * Get participations by parent (for parent to see their children)
   */
  async getParticipationsByParent(
    parentId: string,
    options: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    // Join với Child để lấy children của parent
    const [records, total] = await Promise.all([
      VaccinationParticipation.find()
        .populate({
          path: 'student',
          match: { userId: new Types.ObjectId(parentId) }
        })
        .populate('campaign')
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .sort(sort || { createdAt: -1 })
        .exec()
        .then(results => results.filter(r => r.student)), // Lọc những record có student match

      VaccinationParticipation.countDocuments({})
        .populate({
          path: 'student',
          match: { userId: new Types.ObjectId(parentId) }
        })
    ]);

    return {
      records,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit)
    };
  }

  /**
   * Update parent consent
   */
  async updateParentConsent(
    participationId: string,
    parentId: string,
    consent: 'approved' | 'denied',
    note?: string
  ): Promise<IVaccinationParticipation | null> {
    // Kiểm tra quyền: chỉ parent của student mới được cập nhật
    const participation = await VaccinationParticipation.findById(participationId)
      .populate('student')
      .exec();

    if (!participation) {
      throw new Error("Participation not found");
    }

    if ((participation.student as any).userId.toString() !== parentId) {
      throw new Error("You can only update consent for your own children");
    }

    return this.update(participationId, {
      parentConsent: consent,
      parentNote: note,
      parentConsentDate: new Date(),
      vaccinationStatus: consent === 'denied' ? 'cancelled' : 'scheduled'
    });
  }
  /**
   * Record vaccination (nurse function)
   */
  async recordVaccination(
    participationId: string,
    nurseId: string,
    status: 'completed' | 'missed' | 'cancelled',
    note?: string
  ): Promise<IVaccinationParticipation | null> {
    const updateData: Partial<IVaccinationParticipation> = {
      vaccinationStatus: status,
      nurseNote: note
    };

    if (status === 'completed') {
      updateData.vaccinationDate = new Date();
      updateData.vaccinatedNurse = new Types.ObjectId(nurseId);
    }

    return this.update(participationId, updateData);
  }

  /**
   * Get students with pending consent for a campaign
   */
  async getStudentsWithPendingConsent(
    campaignId: string,
    options: PaginationOptions
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    const filter: FilterOptions<IVaccinationParticipation> = {
      campaign: new Types.ObjectId(campaignId),
      parentConsent: "pending"
    };

    return this.paginate(filter, options);
  }

  /**
   * Get approved students ready for vaccination
   */
  async getApprovedStudentsForVaccination(
    campaignId: string,
    options: PaginationOptions
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    const filter: FilterOptions<IVaccinationParticipation> = {
      campaign: new Types.ObjectId(campaignId),
      parentConsent: "approved",
      vaccinationStatus: "scheduled"
    };

    return this.paginate(filter, options);
  }

  /**
   * Get participations by campaign with filters
   */
  async getParticipationsByCampaignWithFilters(
    campaignId: string,
    filters: { parentConsent?: string; vaccinationStatus?: string; },
    options: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    const filter: FilterOptions<IVaccinationParticipation> = {
      campaign: new Types.ObjectId(campaignId)
    };

    if (filters.parentConsent) {
      filter.parentConsent = filters.parentConsent as any;
    }
    if (filters.vaccinationStatus) {
      filter.vaccinationStatus = filters.vaccinationStatus as any;
    }

    return this.paginate(filter, options, sort);
  }

  /**
   * Get participations by parent with filters
   */
  async getParticipationsByParentWithFilters(
    parentId: string,
    filters: { parentConsent?: string; vaccinationStatus?: string; },
    options: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    // Build aggregation pipeline
    const matchStage: any = {};

    if (filters.parentConsent) {
      matchStage.parentConsent = filters.parentConsent;
    }
    if (filters.vaccinationStatus) {
      matchStage.vaccinationStatus = filters.vaccinationStatus;
    }

    const pipeline = [
      {
        $lookup: {
          from: 'children',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      {
        $match: {
          'studentInfo.userId': new Types.ObjectId(parentId),
          ...matchStage
        }
      },
      {
        $lookup: {
          from: 'vaccinationcampaigns',
          localField: 'campaign',
          foreignField: '_id',
          as: 'campaignInfo'
        }
      }
    ];

    const [records, totalResult] = await Promise.all([
      VaccinationParticipation.aggregate([
        ...pipeline,
        { $skip: (options.page - 1) * options.limit },
        { $limit: options.limit },
        { $sort: sort || { createdAt: -1 } }
      ]).exec(),

      VaccinationParticipation.aggregate([
        ...pipeline,
        { $count: "total" }
      ]).exec()
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      records,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit)
    };
  }
  /**
   * Search participations with advanced filters using BaseQueryBuilder
   */
  async searchParticipations(
    queryBuilder: VaccinationParticipationQueryBuilder
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    if (queryBuilder.getKeyword()) {
      // Nếu có keyword, sử dụng aggregation để search trong related collections
      return this.searchParticipationsWithKeyword(queryBuilder);
    }

    // Nếu không có keyword, sử dụng simple filter
    const filter = queryBuilder.buildFilter();

    const [records, total] = await Promise.all([
      this.model.find(filter)
        .populate('campaign', 'vaccineName vaccineType startDate status')
        .populate('student', 'name studentCode')
        .populate('createdBy', 'name email')
        .populate('vaccinatedNurse', 'name email')
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
   * Search participations with keyword using aggregation
   */
  private async searchParticipationsWithKeyword(
    queryBuilder: VaccinationParticipationQueryBuilder
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    const filter = queryBuilder.buildFilter();
    const keywordMatch = queryBuilder.buildKeywordMatch();

    const pipeline = [
      // Lookup campaign info
      {
        $lookup: {
          from: 'vaccinationcampaigns',
          localField: 'campaign',
          foreignField: '_id',
          as: 'campaignInfo'
        }
      },
      // Lookup student info
      {
        $lookup: {
          from: 'children',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      // Lookup created by info
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByInfo'
        }
      },
      // Lookup nurse info
      {
        $lookup: {
          from: 'users',
          localField: 'vaccinatedNurse',
          foreignField: '_id',
          as: 'nurseInfo'
        }
      },
      // Match with filter and keyword
      {
        $match: {
          ...filter,
          ...keywordMatch
        }
      },      // Project để trả về đúng format như populate và ẩn password
      {
        $project: {
          _id: 1,
          campaign: { $arrayElemAt: ['$campaignInfo', 0] },
          student: { $arrayElemAt: ['$studentInfo', 0] },
          parentConsent: 1,
          parentConsentDate: 1,
          parentNote: 1,
          vaccinationStatus: 1,
          vaccinationDate: 1,
          vaccinatedNurse: {
            _id: { $arrayElemAt: ['$nurseInfo._id', 0] },
            name: { $arrayElemAt: ['$nurseInfo.name', 0] },
            email: { $arrayElemAt: ['$nurseInfo.email', 0] }
            // Ẩn password
          },
          nurseNote: 1,
          createdBy: {
            _id: { $arrayElemAt: ['$createdByInfo._id', 0] },
            name: { $arrayElemAt: ['$createdByInfo.name', 0] },
            email: { $arrayElemAt: ['$createdByInfo.email', 0] }
            // Ẩn password
          },
          createdAt: 1,
          updatedAt: 1
        }
      }
    ];

    const [records, totalResult] = await Promise.all([
      VaccinationParticipation.aggregate([
        ...pipeline,
        { $skip: queryBuilder.getSkip() },
        { $limit: queryBuilder.getLimit() },
        { $sort: queryBuilder.getSort() }
      ]).exec(),

      VaccinationParticipation.aggregate([
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
  }  /**
   * Search participations by parent with BaseQueryBuilder
   */
  async searchParticipationsByParent(
    parentId: string,
    queryBuilder: VaccinationParticipationQueryBuilder
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    const filter = queryBuilder.buildFilter();
    const keywordMatch = queryBuilder.buildKeywordMatch();

    const pipeline = [
      {
        $lookup: {
          from: 'children',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      {
        $lookup: {
          from: 'vaccinationcampaigns',
          localField: 'campaign',
          foreignField: '_id',
          as: 'campaignInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'vaccinatedNurse',
          foreignField: '_id',
          as: 'nurseInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByInfo'
        }
      },
      {
        $match: {
          'studentInfo.userId': new Types.ObjectId(parentId),
          ...filter,
          // Chỉ apply keyword match nếu có keyword
          ...(queryBuilder.getKeyword() ? keywordMatch : {})
        }
      },      // Project để trả về đúng format và ẩn password
      {
        $project: {
          _id: 1,
          campaign: { $arrayElemAt: ['$campaignInfo', 0] },
          student: { $arrayElemAt: ['$studentInfo', 0] },
          parentConsent: 1,
          parentConsentDate: 1,
          parentNote: 1,
          vaccinationStatus: 1,
          vaccinationDate: 1,
          vaccinatedNurse: {
            _id: { $arrayElemAt: ['$nurseInfo._id', 0] },
            name: { $arrayElemAt: ['$nurseInfo.name', 0] },
            email: { $arrayElemAt: ['$nurseInfo.email', 0] }
            // Ẩn password
          },
          nurseNote: 1,
          createdBy: {
            _id: { $arrayElemAt: ['$createdByInfo._id', 0] },
            name: { $arrayElemAt: ['$createdByInfo.name', 0] },
            email: { $arrayElemAt: ['$createdByInfo.email', 0] }
            // Ẩn password
          },
          createdAt: 1,
          updatedAt: 1
        }
      }
    ];

    const [records, totalResult] = await Promise.all([
      VaccinationParticipation.aggregate([
        ...pipeline,
        { $skip: queryBuilder.getSkip() },
        { $limit: queryBuilder.getLimit() },
        { $sort: queryBuilder.getSort() }
      ]).exec(),

      VaccinationParticipation.aggregate([
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
