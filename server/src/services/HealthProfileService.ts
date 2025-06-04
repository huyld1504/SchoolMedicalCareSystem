import { HealthProfile, IHealthProfile } from "@src/models/HealthProfile";
import { HealthProfileRepository } from "@src/repos/HealthProfileRepo";

class HealthProfileService {
  private healthProfileRepo = new HealthProfileRepository();
  /**
   * Get health profile by student ID.
   */
  async findAllByChildId(studentId: string): Promise<IHealthProfile[]> {
    return this.healthProfileRepo.findAll({ studentId });
  }

  /**
   * Create new version health profile base on student ID, if the profile already exists, create a new version.
   */
  async createProfile( profileData: Partial<IHealthProfile>): Promise<void> {
    await this.healthProfileRepo.createProfile(profileData)
  }
}