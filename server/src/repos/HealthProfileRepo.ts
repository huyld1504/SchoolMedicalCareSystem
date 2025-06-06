import { PaginationOptions } from './../common/interfaces/mongo.interface';
import { BaseRepository } from "@src/common/base/base.repository";
import { FilterOptions, PaginationResult, SortOptions } from "@src/common/interfaces/mongo.interface";
import { HealthProfile, IHealthProfile } from "@src/models/HealthProfile";
import { BaseQueryBuilder } from '@src/payload/request/filter/base.request';
import { Types } from 'mongoose';

export class HealthProfileRepository extends BaseRepository<IHealthProfile> {
  constructor() {
    super(HealthProfile);
  }
  /**
   * Find a list of health profiles by child ID.
   * @param childId - The ID of the child.
   * @param paginationOptions - The pagination options.
     /**
   * Find a list of health profiles by child ID.
   * @param childId - The ID of the child.
   * @param paginationOptions - The pagination options.
   * @param sort - Optional sorting options.
   * @returns The pagination result of health profiles.
   */
  async findByChildId(childId: string, paginationOptions: PaginationOptions, sort?: SortOptions,): Promise<PaginationResult<IHealthProfile>> {
    const filter: FilterOptions<Types.ObjectId> = { studentId: new Types.ObjectId(childId) };
    return this.paginate(filter, paginationOptions, sort);
  }

  /**
   * Find lists of health profiles by child IDs with sorting options.
   * @param childIds - An array of child IDs.
   * @param paginationOptions - The pagination options.
   * @param sort - Sorting options.
   * @returns An pagination result of health profiles.
   */
  async findByChildIds(childIds: string[], paginationOptions: PaginationOptions, sort?: SortOptions): Promise<PaginationResult<IHealthProfile>> {
    const objectIds = childIds.map(id => new Types.ObjectId(id));
    const filter: FilterOptions<Types.ObjectId[]> = { studentId: { $in: objectIds } };
    return this.paginate(filter, paginationOptions, sort);
  }

  /**
   * Search health profiles by student name(student id is objectId), medicalCoverageId.
   * @param filter - Optional filter options.
   * @param sort - Optional sorting options.
   * @return A promise that resolves to an array of health profiles.
   */
  async searchHealthProfiles(
    query: BaseQueryBuilder,
    options: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<IHealthProfile>> {
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
}