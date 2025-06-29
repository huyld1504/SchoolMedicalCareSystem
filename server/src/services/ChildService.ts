import { PaginationResult } from "@src/common/interfaces/mongo.interface";
import { ApplicationError } from "@src/common/util/util.route-errors";
import { Child, IChild } from "@src/models/Child";
import { HealthProfile } from "@src/models/HealthProfile";
import { IUser, User } from "@src/models/User";
import { IChildRequest } from "@src/payload/request/child.request";
import { BaseQueryBuilder } from "@src/payload/request/filter/base.request";
import { ChildQueryBuilder } from "@src/payload/request/filter/child.request";

class ChildService {
  async add(childRequest: IChildRequest, idUser: string): Promise<void> {
    const existingChild = await Child.findOne({
      $or: [
        { studentCode: childRequest.studentCode },
        { medicalConverageId: childRequest.medicalConverageId },
      ],
    });
    if (existingChild) {
      throw new ApplicationError(
        "A child with the same student code or medical coverage ID already exists."
      );
    }
    const child = new Child({
      userId: idUser,
      name: childRequest.name,
      birthdate: childRequest.birthdate,
      studentCode: childRequest.studentCode,
      gender: childRequest.gender,
      medicalConverageId: childRequest.medicalConverageId,
    });
    await child.save();

    // Assuming HealthProfile is a model that needs to be created as well
    const healthProfile = new HealthProfile({
      studentId: child._id,
      height: childRequest.height,
      weight: childRequest.weight,
      bloodType: childRequest.bloodType,
      vision: childRequest.vision,
      allergies: childRequest.allergies,
      chronicDiseases: childRequest.chronicDiseases,
      devicesSupport: childRequest.devicesSupport,
      UserId: idUser,
    });

    await healthProfile.save();
  }

  async getChilds(
    queryBuilder: BaseQueryBuilder,
    idUser: string,
    role: string
  ): Promise<PaginationResult<IChild>> {
    const filter = queryBuilder.buildFilter();

    if (role === "parent") {
      filter.userId = idUser;
    }

    const children = await Child.find(filter)
      .skip(queryBuilder.getSkip())
      .limit(queryBuilder.getLimit())
      .sort(queryBuilder.getSort());

    const count = await Child.countDocuments(filter);
    return {
      records: children,
      total: count,
      page: queryBuilder.getPage(),
      limit: queryBuilder.getLimit(),
      totalPages: Math.ceil(count / queryBuilder.getLimit()),
    };
  }

  async getById(id: string): Promise<IChild | null> {
    return Child.findById(id);
  }
}

const childService = new ChildService();
export default childService;
