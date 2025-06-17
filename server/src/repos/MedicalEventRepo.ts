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
      this.model.find({...filter})
      .populate("userId")
      .populate("studentJoin.studentId")
      .skip(query.getSkip())
      .limit(query.getLimit())
      .sort(query.getSort())
      .exec(),
      this.model.countDocuments({...filter}).exec()
    ]);

    return {
      records: records,
      totalPages: (total > 0) ? Math.ceil(total / query.getLimit()) : 0,
      page: query.getPage(),
      total: total,
      limit: query.getLimit()
    }
  }

  /**
   * Get all medical events.
   * @return A promise that resolves to an array of medical events.
   */
  async getAllMedicalEvents(query: BaseQueryBuilder): Promise<PaginationResult<IMedicalEvent>> {
    const queryFilter = query.buildFilter();
    const [records, total] = await  Promise.all([
      this.model.find({...queryFilter})
      .populate({
        path: "studentJoin.studentId",
        ref: "Child"
      })
      .populate("userId")
      .skip(query.getSkip())
      .limit(query.getLimit())
      .sort(query.getSort())
      .exec(),
      this.model.countDocuments({...queryFilter}).exec()
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
   */
  async getMedicalEventById(eventId: string): Promise<IMedicalEvent | null> {
    return this.model.findById(eventId).populate("userId").populate("studentJoin.studentId").exec();
  }

  /**
   * Create a new medical event.
   * @param data - The data for the new medical event.
   */
  async createMedicalEvent(data: IMedicalEvent, userId: string): Promise<void> {
    const medicalEvent = new this.model({ ...data, userId: userId});
    await medicalEvent.save();
  }

  /**
   * Update a medical event by its ID.
   * @param eventId - The ID of the medical event to update.
   * @param data - The data to update the medical event with.
   */
  async updateMedicalEvent(eventId: string, data: IMedicalEvent): Promise<IMedicalEvent | null> {
    return await this.model.findByIdAndUpdate(eventId, data).populate("userId").populate("studentJoin.studentId").exec();
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
    return await this.model.find({...filter}).populate("userId").populate("studentJoin.studentId");
  }
}