import { refreshToken } from './../common/libs/lib.jwt';
import { BaseRepository } from "@src/common/base/base.repository";
import { FilterOptions, PaginationOptions, PaginationResult, SortOptions } from "@src/common/interfaces/mongo.interface";
import { ApplicationError } from "@src/common/util/util.route-errors";
import { VaccinationParticipation, IVaccinationParticipation } from "@src/models/VaccinationParticipation";
import { VaccinationParticipationQueryBuilder } from "@src/payload/request/filter/vaccination.request";
import { Types } from "mongoose";

export class VaccinationParticipationRepository extends BaseRepository<IVaccinationParticipation> {
  constructor() {
    super(VaccinationParticipation);
  }

  /**
   * Add students to campaign (bulk insert)
   * Chức năng: Thêm học sinh vào chiến dịch tiêm chủng
   * Tối ưu hóa:
   * - Sử dụng bulk insert để giảm số lượng truy vấn
   * @param campaignId - ID của chiến dịch
   * @param studentIds - Mảng ID của học sinh
   * @param adminId - ID của admin thực hiện thao tác
   * @return Promise<void>
   * @throws Error nếu có lỗi trong quá trình thêm học sinh
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
   * Chức năng: Lấy danh sách tham gia tiêm chủng theo chiến dịch
   * Tối ưu hóa:
   * - Sử dụng compound indexes cho trường campaign và vaccinationStatus
   * @param campaignId - ID của chiến dịch
   * @param options - Tùy chọn phân trang bao gồm page và limit
   * @param sort - Tùy chọn sắp xếp (nếu cần)
   * @return Promise<PaginationResult<IVaccinationParticipation>>
   * @throws Error nếu không tìm thấy chiến dịch hoặc có lỗi trong quá trình truy vấn
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
   * Chức năng: Lấy danh sách tham gia tiêm chủng của học sinh thuộc về phụ huynh
   * Tối ưu hóa:
   * - Sử dụng populate để lấy thông tin học sinh và chiến dịch
   * - Sử dụng pagination để giới hạn số lượng kết quả trả về
   * @param parentId - ID của phụ huynh
   * @param options - Tùy chọn phân trang bao gồm page và limit
   * @return Promise<PaginationResult<IVaccinationParticipation>>
   * @throws Error nếu không tìm thấy phụ huynh hoặc có lỗi trong quá trình truy vấn
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
   * Update parent consent with validation
   * Chức năng: Cập nhật đồng ý của phụ huynh cho học sinh
   * Business Rules:
   * - Nếu phụ huynh TỪCHỐI (denied): BẮT BUỘC phải có lý do trong parentNote
   * - Nếu phụ huynh ĐỒNG Ý (approved): parentNote là tùy chọn
   * 
   * Tối ưu hóa:
   * - Sử dụng compound indexes cho trường parentConsent và vaccinationStatus
   * @param participationId - ID của tham gia
   * @param parentId - ID của phụ huynh
   * @param consent - Trạng thái đồng ý (approved, denied)
   * @param note - Ghi chú từ phụ huynh (BẮT BUỘC nếu consent = 'denied')
   * @return Promise<IVaccinationParticipation | null>
   * @throws Error nếu participation không tồn tại, phụ huynh không có quyền, hoặc thiếu lý do từ chối
   */
  async updateParentConsent(
    participationId: string,
    parentId: string,
    consent: 'approved' | 'denied',
    note?: string
  ): Promise<IVaccinationParticipation | null> {
    // 🚨 BUSINESS RULE VALIDATION
    if (consent === 'denied' && (!note || note.trim().length === 0)) {
      throw new ApplicationError("Lý do từ chối là bắt buộc khi phụ huynh không đồng ý tiêm chủng");
    }

    // Kiểm tra quyền: chỉ parent của student mới được cập nhật
    const participation = await VaccinationParticipation.findById(participationId)
      .populate('student')
      .exec();

    if (!participation) {
      throw new ApplicationError("Không tìm thấy thông tin tham gia tiêm chủng");
    }

    if ((participation.student as any).userId.toString() !== parentId) {
      throw new ApplicationError("Bạn chỉ có thể cập nhật đồng ý cho con em của mình");
    }

    // Prepare update data
    const updateData: Partial<IVaccinationParticipation> = {
      parentConsent: consent,
      parentConsentDate: new Date(),
      vaccinationStatus: consent === 'denied' ? 'cancelled' : 'scheduled'
    };

    // Add parent note if provided (required for denied, optional for approved)
    if (note && note.trim().length > 0) {
      updateData.parentNote = note.trim();
    }

    return this.update(participationId, updateData);
  }  /**
   * Record vaccination (nurse function) with enhanced validation
   * Chức năng: Ghi nhận kết quả tiêm chủng của học sinh   * Business Rules:
   * - nurseNote là TÙY CHỌN cho tất cả trường hợp (completed, missed, cancelled)
   * - Nếu có nurseNote thì phải có nội dung có nghĩa (không được chỉ space)
   * - Status 'completed' yêu cầu vaccinationDate từ y tá và vaccinatedNurse
   * 
   * Tối ưu hóa:
   * - Sử dụng compound indexes cho trường vaccinationStatus và vaccinatedNurse
   * @param participationId - ID của tham gia
   * @param nurseId - ID của y tá thực hiện tiêm
   * @param status - Trạng thái tiêm chủng (completed, missed, cancelled)
   * @param vaccinationDate - Ngày tiêm do y tá nhập (bắt buộc khi status = completed)
   * @param note - Ghi chú từ y tá (TÙY CHỌN - có thể để trống)
   * @return Promise<IVaccinationParticipation | null>
   * @throws Error nếu participation không tồn tại hoặc đã được tiêm chủng  
   */  async recordVaccination(
    participationId: string,
    nurseId: string,
    status: 'completed' | 'missed' | 'cancelled',
    vaccinationDate?: Date,
    note?: string
  ): Promise<IVaccinationParticipation | null> {
    // Prepare base update data
    const updateData: Partial<IVaccinationParticipation> = {
      vaccinationStatus: status,
    };    // Add nurse note only if provided and has meaningful content
    if (note && note.trim().length > 0) {
      updateData.nurseNote = note.trim();
    }

    // For completed vaccination, use provided date and record nurse
    if (status === 'completed') {
      if (!vaccinationDate) {
        throw new Error('Vaccination date is required when status is completed');
      }
      updateData.vaccinationDate = vaccinationDate; // Sử dụng ngày do y tá nhập
      updateData.vaccinatedNurse = new Types.ObjectId(nurseId); // Lưu ID y tá thực hiện
    }

    return this.update(participationId, updateData);
  }

  /**
   * Get students with pending consent for a campaign
   * Chức năng: Lấy danh sách học sinh có consent từ phụ huynh đang chờ xử lý
   * Tối ưu hóa:
   * - Sử dụng compound indexes cho trường parentConsent  
   * * @param campaignId - ID của chiến dịch
   * @param options - Tùy chọn phân trang bao gồm page và limit
   * @return Promise<PaginationResult<IVaccinationParticipation>> 
   * @throws Error nếu không tìm thấy chiến dịch hoặc có lỗi trong quá trình truy vấn
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
   * Chức năng: Lấy danh sách học sinh đã được phụ huynh đồng ý tiêm chủng
   * Tối ưu hóa:
   * - Sử dụng compound indexes cho các trường parentConsent và vaccinationStatus
   * - Sử dụng pagination để giới hạn số lượng kết quả trả về
   * @param campaignId - ID của chiến dịch  
   * @param options - Tùy chọn phân trang bao gồm page và limit
   * @return Promise<PaginationResult<IVaccinationParticipation>>
   * @throws Error nếu không tìm thấy chiến dịch hoặc có lỗi trong quá trình truy vấn
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
   * Chức năng: Lấy danh sách tham gia theo chiến dịch với các bộ lọc
   * Tối ưu hóa:
   * - Sử dụng compound indexes cho các trường parentConsent và vaccinationStatus
   * - Sử dụng pagination để giới hạn số lượng kết quả trả về
   * @param campaignId - ID của chiến dịch
   * @param filters - Bộ lọc bao gồm parentConsent và vaccinationStatus
   * @param options - Tùy chọn phân trang bao gồm page và limit
   * @param sort - Tùy chọn sắp xếp (nếu cần) 
   * @return Promise<PaginationResult<IVaccinationParticipation>>
    * @throws Error nếu không tìm thấy chiến dịch hoặc có lỗi trong quá trình truy vấn
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

    const [records, total] = await Promise.all([
      VaccinationParticipation.find(filter)
        .populate('campaign', 'vaccineName vaccineType startDate status') // Chỉ lấy các trường cần thiết
        .populate('student', 'name studentCode') // Chỉ lấy các trường cần thiết
        .populate('createdBy', 'name email') // Chỉ lấy các trường cần thiết
        .populate('vaccinatedNurse', 'name email') // Chỉ lấy các trường cần thiết
        .skip((options.page - 1) * options.limit)
        .limit(options.limit || 10)
        .sort(sort || { createdAt: -1 })
        .exec(),
      VaccinationParticipation.countDocuments(filter).exec(),
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

  // ============================================================================
  //                        SEARCH METHODS - OPTIMIZED WITH INDEXES
  // ============================================================================

  /**
   * 🔍 MAIN SEARCH METHOD - Smart Query Routing
   * 
   * Chức năng: Entry point cho tất cả search operations
   * Tối ưu hóa: Chọn strategy phù hợp dựa trên presence của keyword
   * 
   * Logic:
   * - Có keyword → Dùng Aggregation Pipeline (search multi-fields)
   * - Không keyword → Dùng Simple Filter Query (performance cao hơn)
   * 
   * @param queryBuilder - Object chứa tất cả query parameters
   * @returns Paginated results với relevant data
   */
  async searchParticipations(
    queryBuilder: VaccinationParticipationQueryBuilder
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    // 🚀 PERFORMANCE OPTIMIZATION: Smart routing dựa trên keyword presence
    if (queryBuilder.getKeyword()) {
      // Strategy 1: Aggregation Pipeline cho keyword search
      // - Pros: Có thể search trong related collections (campaign, student, user)
      // - Cons: Phức tạp hơn, tốn resources hơn
      return this.searchWithAggregationPipeline(queryBuilder);
    }

    // Strategy 2: Simple MongoDB Query cho basic filtering
    // - Pros: Performance cao, sử dụng indexes efficiently
    // - Cons: Chỉ search trong current collection
    return this.searchWithSimpleFilter(queryBuilder);
  }

  /**
   * 🔧 SIMPLE FILTER SEARCH - High Performance Strategy
   * 
   * Chức năng: Search với MongoDB query đơn giản, tối ưu cho performance
   * 
   * Tối ưu hóa:
   * - Sử dụng compound indexes: (campaign + parentConsent), (campaign + vaccinationStatus)
   * - Populate chỉ select fields cần thiết để giảm data transfer
   * - Sort theo createdAt index
   * 
   * @param queryBuilder - Query parameters không có keyword
   * @returns Paginated results với populated data
   */
  private async searchWithSimpleFilter(
    queryBuilder: VaccinationParticipationQueryBuilder
  ): Promise<PaginationResult<IVaccinationParticipation>> {
    // Build filter từ query parameters (không có keyword matching)
    const filter = queryBuilder.buildFilter();

    // 📊 PARALLEL EXECUTION: Chạy đồng thời query + count để tối ưu response time
    const [records, total] = await Promise.all([
      // Main query với optimized indexes và selective population
      this.model.find(filter)
        // 🔗 SELECTIVE POPULATE: Chỉ lấy fields cần thiết, ẩn sensitive data
        .populate('campaign', 'vaccineName vaccineType startDate status') // Campaign basics
        .populate('student', 'name studentCode') // Student basics
        .populate('createdBy', 'name email') // Creator info (NO password)
        .populate('vaccinatedNurse', 'name email') // Nurse info (NO password)
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
   * Chức năng: Search với keyword across multiple related collections
   * 
   * Tối ưu hóa:
   * - Sử dụng $lookup để join với related collections
   * - $match sớm để giảm data cần process
   * - Text search indexes cho keyword matching
   * - Projection để chỉ trả về fields cần thiết
   * 
   * Pipeline stages:
   * 1. $lookup: Join với campaigns, students, users
   * 2. $match: Filter theo basic criteria + keyword matching
   * 3. $project: Format output và hide sensitive fields
   * 4. $sort: Sort theo relevance + user criteria
   * 5. $skip/$limit: Pagination
   * 
   * @param queryBuilder - Query parameters có keyword
   * @returns Paginated results với joined data
   */
  private async searchWithAggregationPipeline(
    queryBuilder: VaccinationParticipationQueryBuilder): Promise<PaginationResult<IVaccinationParticipation>> {
    // Build filter conditions (không bao gồm keyword matching)
    const filter = queryBuilder.buildFilter();
    // Build keyword matching conditions cho aggregation
    const keywordMatch = queryBuilder.buildKeywordMatch();

    // 🔄 AGGREGATION PIPELINE: Multi-stage processing cho complex search
    const pipeline = [
      // 🔗 STAGE 1: JOIN WITH CAMPAIGNS
      // Mục đích: Lấy thông tin campaign để search trong vaccineName, vaccineType, etc.
      {
        $lookup: {
          from: 'vaccinationcampaigns', // Collection name trong MongoDB
          localField: 'campaign', // Field trong VaccinationParticipation
          foreignField: '_id', // Field trong VaccinationCampaign
          as: 'campaignInfo' // Alias cho joined data
        }
      },
      // 🔗 STAGE 2: JOIN WITH STUDENTS/CHILDREN
      // Mục đích: Lấy thông tin student để search trong name, studentCode
      {
        $lookup: {
          from: 'children', // Children collection
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      // 🔗 STAGE 3: JOIN WITH CREATOR INFO
      // Mục đích: Lấy thông tin user tạo record để search trong name, email
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByInfo'
        }
      },
      // 🔗 STAGE 4: JOIN WITH NURSE INFO
      // Mục đích: Lấy thông tin nurse để search trong name, email
      {
        $lookup: {
          from: 'users',
          localField: 'vaccinatedNurse',
          foreignField: '_id',
          as: 'nurseInfo'
        }
      },
      // 🎯 STAGE 5: FILTERING
      // Mục đích: Apply tất cả filter conditions + keyword matching
      {
        $match: {
          ...filter, // Basic filters (campaign, student, status, date ranges)
          ...keywordMatch // Keyword search across joined collections
        }
      },
      // 🔒 STAGE 6: PROJECTION & SECURITY
      // Mục đích: Format output và hide sensitive information (passwords)
      {
        $project: {
          _id: 1,
          // Campaign info (first element from array)
          campaign: { $arrayElemAt: ['$campaignInfo', 0] },
          // Student info
          student: { $arrayElemAt: ['$studentInfo', 0] },
          // Participation fields
          parentConsent: 1,
          parentConsentDate: 1,
          parentNote: 1,
          vaccinationStatus: 1,
          vaccinationDate: 1,
          nurseNote: 1,
          createdAt: 1,
          updatedAt: 1,
          // 🔒 SECURE USER INFO: Chỉ expose safe fields
          vaccinatedNurse: {
            _id: { $arrayElemAt: ['$nurseInfo._id', 0] },
            name: { $arrayElemAt: ['$nurseInfo.name', 0] },
            email: { $arrayElemAt: ['$nurseInfo.email', 0] }
            // ❌ Password và sensitive fields được ẩn
          },
          createdBy: {
            _id: { $arrayElemAt: ['$createdByInfo._id', 0] },
            name: { $arrayElemAt: ['$createdByInfo.name', 0] },
            email: { $arrayElemAt: ['$createdByInfo.email', 0] }
            // ❌ Password và sensitive fields được ẩn
          }
        }
      }
    ];

    // 📊 PARALLEL EXECUTION: Chạy đồng thời data query + count query
    const [records, totalResult] = await Promise.all([
      // Main aggregation với pagination và sorting 
      VaccinationParticipation.aggregate([
        ...pipeline,
        // 📈 SORTING: Sort theo user criteria        // 📈 SORTING: Sort theo user criteria
        { $sort: queryBuilder.getSort() },
        // 📄 PAGINATION: Skip và limit
        { $skip: queryBuilder.getSkip() },
        { $limit: queryBuilder.getLimit() }
      ]).exec(),

      // Count aggregation để tính total records
      VaccinationParticipation.aggregate([
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

  /**
  * 👨‍👩‍👧‍👦 PARENT SEARCH - Scoped Search for Parent's Children Only
  * 
  * Chức năng: Phụ huynh search vaccination records của con em mình
  * 
  * Security:
  * - Chỉ search trong children của parent đó (userId matching)
  * - Không thể access data của children khác
  * - Same optimization strategies như general search
  * 
  * Tối ưu hóa:
  * - Sử dụng aggregation pipeline với early filtering
  * - Student lookup với userId matching ngay từ đầu
  * - Index optimization: student + userId composite index
  * 
  * @param parentId - ID của parent user
  * @param queryBuilder - Query parameters (có thể có keyword)
  * @returns Paginated results chỉ của children thuộc parent
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
