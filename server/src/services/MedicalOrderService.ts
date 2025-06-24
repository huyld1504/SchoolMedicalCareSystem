import { PaginationResult } from "@src/common/interfaces/mongo.interface";
import { ApplicationError } from "@src/common/util/util.route-errors";
import { Child } from "@src/models/Child";
import { IMedicalOrder, MedicalOrder } from "@src/models/MedicalOrder";
import {
  IMedicalOrderDetail,
  MedicalOrderDetail,
} from "@src/models/MedicalOrderDetail";
import { OrderMedicalQueryBuilder } from "@src/payload/request/filter/orderMedical.request";
import {
  IMedicalOrderDetailAdditional,
  IMedicalOrderDetailCreate,
  IMedicalOrderWithDetailsCreate,
} from "@src/payload/request/orderMedical.request";
import { AnyBulkWriteOperation, Types } from "mongoose";

class MedicalOrderService {
  async add(
    medicalOrderCreate: IMedicalOrderWithDetailsCreate,
    userId: string
  ): Promise<void> {
    const { medicalOrderDetails, medicalOrder } = medicalOrderCreate;
    const existingChild = await Child.findOne({
      _id: medicalOrder.ChildId,
      userId: userId,
    });
    if (!existingChild) {
      throw new ApplicationError(
        "Child not found or does not belong to the user"
      );
    }
    const newMedicalOrder = new MedicalOrder(medicalOrder);
    await newMedicalOrder.save();
    if (medicalOrderDetails && medicalOrderDetails.length > 0) {
      await this.addDetails(
        medicalOrderDetails.map((detail) => ({
          ...detail,
          medicalOrderId: newMedicalOrder._id,
        }))
      );
    }
  }

  async addDetails(
    medicalOrderDetails: IMedicalOrderDetailCreate[]
  ): Promise<void> {
    await MedicalOrderDetail.bulkWrite(
      medicalOrderDetails.map((detail) => ({
        insertOne: {
          document: detail,
        },
      }))
    );
  }

  async getMedicalOrders(
    queryBuilder: OrderMedicalQueryBuilder,
    idUser: string,
    role: string
  ): Promise<PaginationResult<IMedicalOrder>> {
    const filter = await queryBuilder.buildFilter(role, idUser);

    const query = MedicalOrder.find(filter)
      .lean()
      .skip(queryBuilder.getSkip())
      .limit(queryBuilder.getLimit())
      .sort(queryBuilder.getSort());

    query.populate({
      path: "ChildId",
      select: "name parentId",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

    const [medicalOrders, totalCount] = await Promise.all([
      query.exec(),
      MedicalOrder.countDocuments(filter),
    ]);

    return {
      records: medicalOrders,
      total: totalCount,
      page: queryBuilder.getPage(),
      limit: queryBuilder.getLimit(),
      totalPages: Math.ceil(totalCount / queryBuilder.getLimit()),
    };
  }

  async updateStatus(
    medicalOrderId: string,
    status: string,
    note: string
  ): Promise<void> {
    const medicalOrder = await MedicalOrder.findById(medicalOrderId);
    if (!medicalOrder) {
      throw new ApplicationError("Medical order not found");
    }
    medicalOrder.status = status;
    if (status === "canceled") {
      if (!note) {
        throw new ApplicationError("Note is required for canceling the order");
      }
      medicalOrder.note = note;
    }
    await medicalOrder.save();
  }

  async getMedicalOrderById(medicalOrderId: string): Promise<{
    order: IMedicalOrder;
    details: IMedicalOrderDetail[];
  }> {
    const order = await MedicalOrder.findById(medicalOrderId).lean().exec();

    if (!order) {
      throw new ApplicationError("Medical order not found");
    }

    const details = await MedicalOrderDetail.find({
      medicalOrderId: new Types.ObjectId(medicalOrderId),
    })
      .lean()
      .exec();

    return {
      order,
      details,
    };
  }

  async additionalDetails(
    medicalOrderId: string,
    medicalOrderAdditional: IMedicalOrderDetailAdditional
  ): Promise<void> {
    const medicalOrder = await MedicalOrder.findById(medicalOrderId);
    if (!medicalOrder) {
      throw new ApplicationError("Medical order not found");
    }

    const orderObjectId = new Types.ObjectId(medicalOrderId);

    const existingDetails = await MedicalOrderDetail.find({
      medicalOrderId: orderObjectId,
    });

    const existingDetailsMap = new Map(
      existingDetails.map((detail) => [detail.id.toString(), detail])
    );

    const bulkOps: AnyBulkWriteOperation<IMedicalOrderDetail>[] = [];
    const processedDetailIds = new Set<string>();

    medicalOrderAdditional.medicalOrderDetails.forEach((detail) => {
      const detailId = detail._id?.toString();

      if (detailId && existingDetailsMap.has(detailId)) {
        bulkOps.push({
          updateOne: {
            filter: { _id: new Types.ObjectId(detailId) },
            update: {
              $set: {
                medicineName: detail.medicineName,
                dosage: detail.dosage,
                type: detail.type,
                time: detail.time,
                note: detail.note ?? "",
                quantity:
                  detail.quantity +
                  (existingDetailsMap.get(detailId)?.quantity || 0),
              },
            },
          },
        });
        processedDetailIds.add(detailId);
      } else {
        bulkOps.push({
          insertOne: {
            document: {
              medicalOrderId: orderObjectId,
              medicineName: detail.medicineName,
              dosage: detail.dosage,
              type: detail.type,
              time: detail.time,
              note: detail.note,
              quantity: detail.quantity,
            },
          },
        });
      }
    });

    if (bulkOps.length > 0) {
      await MedicalOrderDetail.bulkWrite(bulkOps);
    }

    medicalOrder.isStock = true;
    await medicalOrder.save();
  }
}

const medicalOrderService = new MedicalOrderService();
export default medicalOrderService;
