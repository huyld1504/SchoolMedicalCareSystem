import { PaginationOptions } from './../common/interfaces/mongo.interface';
import { BaseRepository } from "@src/common/base/base.repository";
import { PaginationResult, SortOptions } from "@src/common/interfaces/mongo.interface";
import { HealthProfile, IHealthProfile } from "@src/models/HealthProfile";
import { BaseQueryBuilder } from '@src/payload/request/filter/base.request';
import { Types } from 'mongoose';

export class HealthProfileRepository extends BaseRepository<IHealthProfile> {
  constructor() {
    super(HealthProfile);
  }
  /**
  * Find health profiles by child ID with pagination and sorting options.
  * @param childId - The ID of the child.
  * @param query - The query builder containing pagination and sorting options.
  * @returns A promise that resolves to a pagination result of health profiles.
   */
  async findByChildId(childId: string, query: BaseQueryBuilder): Promise<PaginationResult<IHealthProfile>> {
    const queryBuilder = query.buildFilter();

    const filter = {
      studentId: new Types.ObjectId(childId),
      ...queryBuilder
    };
    const options: PaginationOptions = {
      page: query.getPage(),
      limit: query.getLimit()
    };
    const sort: SortOptions = query.getSort() || { createdAt: -1 }; // Default sort by createdAt descending
    const [records, total] = await Promise.all([
      await this.model.find(filter)
        .populate("studentId")
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .sort(sort)
        .exec(),
      await this.model.countDocuments(filter).exec()
    ]);

    return {
      records: records,
      total: total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit)
    };
  }

  /**
   * Find lists of health profiles by child IDs with sorting options.
   * @param childIds - An array of child IDs.
    * @param query - The query builder containing pagination and sorting options.
    * @return A promise that resolves to a pagination result of health profiles.
   * @throws Error if no child IDs are provided.
   */
  async findByChildIds(childIds: string[], query: BaseQueryBuilder): Promise<PaginationResult<IHealthProfile>> {
    const queryBuilder = query.buildFilter();
    if (!childIds || childIds.length === 0) {
      throw new Error("Child IDs are required.");
    }
    const filter = {
      studentId: { $in: childIds.map(id => new Types.ObjectId(id)) },
      ...queryBuilder
    };

    const options: PaginationOptions = {
      page: query.getPage(),
      limit: query.getLimit()
    };
    const sort: SortOptions = query.getSort() || { createdAt: -1 }; // Default sort by createdAt descending
    return this.paginate(filter, options, sort);
  }

  /**
   * Search health profiles by student name(student id is objectId), medicalCoverageId.
   * @param query - The query builder containing pagination and sorting options.
   * @return A promise that resolves to a pagination result of health profiles.
   * @throws Error if no query is provided.
   */
  async searchHealthProfiles(
    query: BaseQueryBuilder
  ): Promise<PaginationResult<IHealthProfile>> {
    const options: PaginationOptions = {
      page: query.getPage(),
      limit: query.getLimit()
    };
    const sort: SortOptions = query.getSort() || { createdAt: -1 }; // Default sort by createdAt descending

    const filter = query.buildFilter();
    return this.paginate(filter, options, sort);
  }

  /**
   * Add a new health profile.
   * @param healthProfile - The health profile to add.
   * @return A promise that resolves when the profile is added.
   */
  async add(healthProfile: IHealthProfile): Promise<void> {
    const newProfile = new HealthProfile(healthProfile);
    await newProfile.save();
  }

  /**
   * Find a health profile by ID.
   * @param id - The ID of the health profile.
   * @return A promise that resolves to the health profile or null if not found.
   */
  async findById(id: string): Promise<IHealthProfile | null> {
    return this.model.findById(id)
      .populate([
        {
          path: 'studentId',
          select: 'name studentCode medicalConverageId', // Select only the fields you need
        },
        {
          path: 'UserId',
          select: '-password', // Select only the fields you need
        }
      ])
      .exec();
  }

  /**
   * Update a health profile by ID.
   * @param id - The ID of the health profile to update.  
   */
  async updateById(id: string, updateData: IHealthProfile): Promise<IHealthProfile | null> {
    return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  /**
   * Delete a health profile by ID.
   * @param id - The ID of the health profile to delete.
   * @return A promise that resolves when the profile is deleted.
   */
  async deleteById(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}