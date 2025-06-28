import { BaseRepository } from "@src/common/base/base.repository";
import { PaginationResult } from "@src/common/interfaces/mongo.interface";
import MedicalEvent, { IMedicalEvent } from "@src/models/MedicalEvent";
import { BaseQueryBuilder } from "@src/payload/request/filter/base.request";

export class MedicalEventRepository extends BaseRepository<IMedicalEvent> {
  constructor() {
    super(MedicalEvent);
  }
  /**
   * Get all medical events for a specific student by their ID.
   * @param studentId - The ID of the student to get medical events for.
   */
  async getMedicalEventsByStudentId(studentId: string, query: BaseQueryBuilder): Promise<PaginationResult<IMedicalEvent>> {
    const filter = query.buildFilter();
    filter.studentJoin = { $elemMatch: { studentId: studentId } };

    const [records, total] = await Promise.all([
      this.model.find({ ...filter })
        .populate({
          path: "userId",
          select: "name email _id isActive"
        })
        .populate({
          path: "studentJoin.studentId",
          select: "name studentCode medicalConverageId"
        })
        .skip(query.getSkip())
        .limit(query.getLimit())
        .sort(query.getSort())
        .exec(),
      this.model.countDocuments({ ...filter }).exec(),
    ]);

    return {
      records: records,
      totalPages: (total > 0) ? Math.ceil(total / query.getLimit()) : 0,
      page: query.getPage(),
      total: total,
      limit: query.getLimit(),
    };
  }
  /**
   * Get all medical events với keyword search support.
   * @return A promise that resolves to a pagination result of medical events.
   */
  async getAllMedicalEvents(query: BaseQueryBuilder): Promise<PaginationResult<IMedicalEvent>> {
    const hasKeyword = query.keyword && query.keyword.trim().length > 0;

    if (hasKeyword) {
      // Sử dụng aggregation pipeline để search trong student info
      return this.getAllMedicalEventsWithAggregation(query);
    } else {
      // Sử dụng query thông thường
      return this.getAllMedicalEventsBasic(query);
    }
  }  /**
   * Get all medical events với aggregation pipeline cho keyword search.
   */
  private async getAllMedicalEventsWithAggregation(query: BaseQueryBuilder): Promise<PaginationResult<IMedicalEvent>> {
    const baseFilter = query.buildFilter();
    // Loại bỏ $or filter vì ta sẽ xử lý keyword search bằng aggregation
    delete baseFilter.$or;

    const pipeline = [
      // Apply base filters TRƯỚC khi unwind (type, level, status, dateHappened)
      ...(Object.keys(baseFilter).length > 0 ? [{ $match: baseFilter }] : []),

      // Unwind studentJoin array để join với Child collection
      { $unwind: '$studentJoin' },

      // Lookup student information
      {
        $lookup: {
          from: 'children',
          localField: 'studentJoin.studentId',
          foreignField: '_id',
          as: 'studentInfo',
        },
      },

      // Unwind student info
      { $unwind: '$studentInfo' },

      // Apply keyword search trong student name và studentCode
      {
        $match: {
          $or: [
            { 'studentInfo.name': { $regex: query.keyword, $options: 'i' } },
            { 'studentInfo.studentCode': { $regex: query.keyword, $options: 'i' } },
            { 'description': { $regex: query.keyword, $options: 'i' } },
            { 'note': { $regex: query.keyword, $options: 'i' } },
            { 'solution': { $regex: query.keyword, $options: 'i' } },
          ],
        },
      },

      // Group back để tái tạo cấu trúc gốc
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$userId' },
          type: { $first: '$type' },
          status: { $first: '$status' },
          level: { $first: '$level' },
          description: { $first: '$description' },
          dateHappened: { $first: '$dateHappened' },
          note: { $first: '$note' },
          solution: { $first: '$solution' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          studentJoin: {
            $push: {
              studentId: '$studentJoin.studentId',
            },
          },
        },
      },

      // Lookup user information (chỉ lấy name, email, _id, isActive)
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                isActive: 1,
              },
            },
          ],
        },
      },

      // Lookup lại student info cho populate 
      // (chỉ lấy name, studentCode, medicalConverageId)
      {
        $lookup: {
          from: 'children',
          localField: 'studentJoin.studentId',
          foreignField: '_id',
          as: 'studentJoinPopulated',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                studentCode: 1,
                medicalConverageId: 1,
              },
            },
          ],
        },
      },

      // Tái tạo studentJoin với populated data
      {
        $addFields: {
          studentJoin: {
            $map: {
              input: '$studentJoin',
              as: 'student',
              in: {
                studentId: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$studentJoinPopulated',
                        cond: { $eq: ['$$this._id', '$$student.studentId'] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },

      // Remove temporary field
      { $unset: 'studentJoinPopulated' },      // Sort
      { $sort: query.getSort() },
    ];

    // Execute aggregation với pagination
    const [records, totalResult] = await Promise.all([
      this.model.aggregate([
        ...pipeline,
        { $skip: query.getSkip() },
        { $limit: query.getLimit() }
      ]).exec(),

      this.model.aggregate([
        ...pipeline,
        { $count: 'total' }
      ]).exec()
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    return {
      records: records as IMedicalEvent[],
      totalPages: (total > 0) ? Math.ceil(total / query.getLimit()) : 0,
      page: query.getPage(),
      total: total,
      limit: query.getLimit()
    };
  }

  /**
   * Get all medical events basic (không có keyword search).
   */  private async getAllMedicalEventsBasic(query: BaseQueryBuilder): Promise<PaginationResult<IMedicalEvent>> {
    const queryFilter = query.buildFilter();
    const [records, total] = await Promise.all([
      this.model.find({ ...queryFilter })
        .populate({
          path: "studentJoin.studentId",
          select: "name studentCode medicalConverageId"
        })
        .populate({
          path: "userId",
          select: "name email _id isActive"
        })
        .skip(query.getSkip())
        .limit(query.getLimit())
        .sort(query.getSort())
        .exec(),
      this.model.countDocuments({ ...queryFilter }).exec()
    ]);

    return {
      records: records,
      totalPages: (total > 0) ? Math.ceil(total / query.getLimit()) : 0,
      page: query.getPage(),
      total: total,
      limit: query.getLimit()
    };
  }

  /**
   * Get a medical event by its ID.
   * @param eventId - The ID of the medical event to retrieve.
   * @return A promise that resolves to the medical event or null if not found.
   */  async getMedicalEventById(eventId: string): Promise<IMedicalEvent | null> {
    return this.model.findById(eventId)
      .populate({
        path: "userId",
        select: "name email _id isActive"
      })
      .populate({
        path: "studentJoin.studentId",
        select: "name studentCode medicalConverageId"
      })
      .exec();
  }

  /**
   * Create a new medical event.
   * @param data - The data for the new medical event.
   */
  async createMedicalEvent(data: IMedicalEvent, userId: string): Promise<void> {
    const medicalEvent = new this.model({ ...data, userId: userId });
    await medicalEvent.save();
  }

  /**
   * Update a medical event by its ID.
   * @param eventId - The ID of the medical event to update.
   * @param data - The data to update the medical event with.
   */  async updateMedicalEvent(eventId: string, data: IMedicalEvent): Promise<IMedicalEvent | null> {
    return await this.model.findByIdAndUpdate(eventId, data)
      .populate({
        path: "userId",
        select: "name email _id isActive"
      })
      .populate({
        path: "studentJoin.studentId",
        select: "name studentCode medicalConverageId"
      })
      .exec();
  }

  /**
   * Delete a medical event by its ID.
   * @param eventId - The ID of the medical event to delete.
  */
  async deleteMedicalEvent(eventId: string) {
    return this.model.findByIdAndDelete(eventId);
  }
  /** 
   * Search medical events based on a query.
   * @param query - The query builder containing search parameters.
  */
  async searchMedicalEvents(query: BaseQueryBuilder) {
    const filter = query.buildFilter();
    return await this.model.find({ ...filter })
      .populate({
        path: "userId",
        select: "name email _id isActive"
      })
      .populate({
        path: "studentJoin.studentId",
        select: "name studentCode medicalConverageId"
      });
  }
}