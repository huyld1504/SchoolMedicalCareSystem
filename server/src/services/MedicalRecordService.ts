import { PaginationResult } from "@src/common/interfaces/mongo.interface";
import { ApplicationError } from "@src/common/util/util.route-errors";
import { MedicalRecordDto } from "@src/dto/dto.medical";
import { MedicalOrder } from "@src/models/MedicalOrder";
import {
  IMedicalOrderDetail,
  MedicalOrderDetail,
} from "@src/models/MedicalOrderDetail";
import { IMedicalRecord, MedicalRecord } from "@src/models/MedicalRecord";
import {
  IMedicalRecordItem,
  MedicalRecordItem,
} from "@src/models/MedicalRecordItem";
import { MedicalRecordQueryBuilder } from "@src/payload/request/filter/medicalRecord.request";
import { IMedicalRecordCreate } from "@src/payload/request/medicalRecord.request";

class MedicalRecordService {
  async add(
    medicalRecordCreate: IMedicalRecordCreate,
    medicalOrderId: string,
    userId: string
  ): Promise<void> {
    // 1. Validate medical order exists and is in correct status
    const medicalOrder = await MedicalOrder.findById(medicalOrderId);

    if (!medicalOrder) {
      throw new ApplicationError("Medical order not found");
    }

    if (
      medicalOrder.status === "completed" ||
      medicalOrder.status === "cancelled"
    ) {
      throw new ApplicationError(
        "Medical order already completed or cancelled, cannot add medical record"
      );
    }

    // 2. Validate all medical order details exist
    const detailIds = medicalRecordCreate.items.map(
      (item) => item.medicalOrderDetailId
    );
    const existingDetails = await MedicalOrderDetail.find({
      _id: { $in: detailIds },
      medicalOrderId: medicalOrderId,
    });

    if (existingDetails.length !== detailIds.length) {
      throw new ApplicationError("Some medical order details not found");
    }

    // 3. Validate quantities
    for (const item of medicalRecordCreate.items) {
      const detail = existingDetails.find(
        (d) => d.id.toString() === item.medicalOrderDetailId
      );

      if (!detail) {
        throw new ApplicationError(
          `Detail ${item.medicalOrderDetailId} not found`
        );
      }

      if (item.quantity > detail.quantity) {
        throw new ApplicationError(
          `Requested quantity (${item.quantity}) exceeds available quantity (${detail.quantity}) for ${detail.medicineName}`
        );
      }
    }

    // 4. Create medical record
    const medicalRecord = new MedicalRecord({
      medicalOrderId: medicalOrderId,
      userId: userId,
    });
    await medicalRecord.save();

    // 5. Update medical order details quantities
    await MedicalOrderDetail.bulkWrite(
      medicalRecordCreate.items.map((item) => ({
        updateOne: {
          filter: {
            _id: item.medicalOrderDetailId,
            medicalOrderId: medicalOrderId,
          },
          update: { $inc: { quantity: -item.quantity } },
        },
      }))
    );

    // 6. Create medical record items
    await MedicalRecordItem.insertMany(
      medicalRecordCreate.items.map((item) => {
        const detail = existingDetails.find(
          (d) => d.id.toString() === item.medicalOrderDetailId
        );

        return {
          medicalRecordId: medicalRecord._id,
          name: detail?.medicineName || "Unknown",
          quantity: item.quantity,
          medicalOrderDetailId: item.medicalOrderDetailId,
        };
      })
    );

    // 7. Check if order should be marked as completed
    const remainingDetails = await MedicalOrderDetail.find({
      medicalOrderId: medicalOrderId,
      quantity: { $gt: 0 },
    });

    if (remainingDetails.length === 0) {
      medicalOrder.isStock = false;
      await medicalOrder.save();
    }
  }

  async getRecordsByMedicalOrderId(
    medicalOrderId: string,
    queryBuilder: MedicalRecordQueryBuilder
  ): Promise<PaginationResult<MedicalRecordDto>> {
    const filter = queryBuilder.buildFilter();
    filter.medicalOrderId = medicalOrderId;

    const medicalRecords = await MedicalRecord.find(filter)
      .populate("userId", "name")
      .lean()
      .skip(queryBuilder.getSkip())
      .limit(queryBuilder.getLimit())
      .sort(queryBuilder.getSort());

    const recordIds = medicalRecords.map((record) => record._id);

    const items = await MedicalRecordItem.find({
      medicalRecordId: { $in: recordIds },
    }).lean();

    const itemMap = new Map<string, IMedicalRecordItem[]>();
    for (const item of items) {
      const key = item.medicalRecordId.toString();
      if (!itemMap.has(key)) {
        itemMap.set(key, []);
      }
      itemMap.get(key)!.push(item);
    }

    const recordsWithItems: MedicalRecordDto[] = medicalRecords.map(
      (record) =>
        ({
          medicalOrderId: record.medicalOrderId,
          userId: record.userId,
          _id: record._id,
          items: itemMap.get(record._id.toString()) || [],
        } as MedicalRecordDto)
    );

    const totalCount = await MedicalRecord.countDocuments(filter);

    return {
      records: recordsWithItems,
      limit: queryBuilder.getLimit(),
      page: queryBuilder.getPage(),
      total: totalCount,
      totalPages: Math.ceil(totalCount / queryBuilder.getLimit()),
    };
  }
}

const medicalRecordService = new MedicalRecordService();
export default medicalRecordService;
