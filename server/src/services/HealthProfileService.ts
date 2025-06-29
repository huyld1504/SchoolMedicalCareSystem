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

  async findByChildIdWithPagination(childId: string, query: BaseQueryBuilder): Promise<PaginationResult<IHealthProfile>> {
    return this.healthProfileRepo.findByChildId(childId, query);
  }
  
  async findByChildIdsWithPagination(childIds: string[], query: BaseQueryBuilder): Promise<PaginationResult<IHealthProfile>> {
    return this.healthProfileRepo.findByChildIds(childIds, query);
  }

  async searchHealthProfiles(query: BaseQueryBuilder): Promise<PaginationResult<IHealthProfile>> {
    return this.healthProfileRepo.searchHealthProfiles(query);
  }

  async addHealthProfile(healthProfile: IHealthProfile, userId: string): Promise<IHealthProfile> {
    const newProfile = new HealthProfile({
      ...healthProfile, 
      UserId: userId
    });
    return this.healthProfileRepo.create(newProfile);
  }

  async getHealthProfileById(id: string)  : Promise<IHealthProfile | null> {
    return this.healthProfileRepo.findById(id);
  }

  async updateHealthProfile(id: string, healthProfile: IHealthProfile): Promise<IHealthProfile | null> {
    return this.healthProfileRepo.updateById(id, healthProfile);
  }
}

const healthProfileService = new HealthProfileService();
export default healthProfileService;