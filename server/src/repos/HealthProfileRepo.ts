import { BaseRepository } from "@src/common/base/base.repository";
import { FilterOptions } from "@src/common/interfaces/mongo.interface";
import { HealthProfile, IHealthProfile } from "@src/models/HealthProfile";

export class HealthProfileRepository extends BaseRepository<IHealthProfile> {
  constructor() {
    super(HealthProfile);
  }

  /**
   * Get health profile by student ID.
   */
  async findAllByChildId(childId: string): Promise<IHealthProfile[]> {
    return this.findAll({ studentId: childId });
  }

  /**
   * Create new version health profile base on student ID
   */
  async createProfile(profileData: Partial<IHealthProfile>): Promise<IHealthProfile> {
    return this.create(profileData);
  }

  /**
   * Search health profiles by student ID, createdAt, and updatedAt.
   */
  async searchProfiles(query: FilterOptions<IHealthProfile>): Promise<IHealthProfile[]> {
    // This method can be implemented to search profiles based on specific criteria.
    // For now, it returns all profiles.
    return this.findAll(query);
  }
}