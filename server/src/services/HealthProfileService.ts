import { PaginationOptions, PaginationResult, SortOptions } from '@src/common/interfaces/mongo.interface';
import { HealthProfile, IHealthProfile } from "@src/models/HealthProfile";
import { User } from '@src/models/User';
import { BaseQueryBuilder } from '@src/payload/request/filter/base.request';
import { HealthProfileRepository } from "@src/repos/HealthProfileRepo";

class HealthProfileService {
  private healthProfileRepo = new HealthProfileRepository();

  async findById(id: string): Promise<IHealthProfile | null> {
    return this.healthProfileRepo.findById(id); 
  }

  async findByChildIdWithPagination(childId: string, options: PaginationOptions, sort?: SortOptions): Promise<PaginationResult<IHealthProfile>> {
    return this.healthProfileRepo.findByChildId(childId, options, sort);
  }
  
  async findByChildIdsWithPagination(childIds: string[], options: PaginationOptions, sort?: SortOptions): Promise<PaginationResult<IHealthProfile>> {
    return this.healthProfileRepo.findByChildIds(childIds, options, sort);
  }

  async searchHealthProfiles(query: BaseQueryBuilder, options: PaginationOptions, sort?: SortOptions): Promise<PaginationResult<IHealthProfile>> {
    return this.healthProfileRepo.searchHealthProfiles(query, options, sort);
  }

  async addHealthProfile(healthProfile: IHealthProfile, userId: string): Promise<IHealthProfile> {
    const newProfile = new HealthProfile({
      ...healthProfile, 
      UserId: userId
    });
    return this.healthProfileRepo.create(newProfile);
  }
}

const healthProfileService = new HealthProfileService();
export default healthProfileService;