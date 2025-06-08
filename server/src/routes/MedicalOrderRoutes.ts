import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { IReq, IRes } from "./common/types";
import { ApiResponse } from "@src/common/util/util.api-response";
import {
  additionalDetailsSchema,
  createMedicalOrderWithDetailsSchema,
} from "@src/schemas/medicalOrder.schema";
import { ValidationError } from "@src/common/util/util.route-errors";
import medicalOrderService from "@src/services/MedicalOrderService";
import { OrderMedicalQueryBuilder } from "@src/payload/request/filter/orderMedical.request";
import medicalRecordService from "@src/services/MedicalRecordService";
import { medicalRecordSchema } from "@src/schemas/medicalRecord.schema";
import { MedicalRecordQueryBuilder } from "@src/payload/request/filter/medicalRecord.request";

async function add(req: IReq, res: IRes) {
  const { error, value } = createMedicalOrderWithDetailsSchema.validate(
    req.body
  );
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  await medicalOrderService.add(value, req.user._id);
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.CREATED,
    "Medical record created successfully"
  );
  res.status(HttpStatusCodes.CREATED).json(response);
}

async function get(req: IReq, res: IRes) {
  const queryBuilder = new OrderMedicalQueryBuilder(req.query);
  const children = await medicalOrderService.getMedicalOrders(
    queryBuilder,
    req.user._id,
    req.role
  );
  res
    .status(HttpStatusCodes.OK)
    .json(
      new ApiResponse(
        HttpStatusCodes.OK,
        "Medical orders retrieved successfully",
        children
      )
    );
}

async function updateStatus(req: IReq, res: IRes) {
  const id: string = req.params.id as string;
  const status: string = req.body.status as string;

  if (!id || !status) {
    throw new ValidationError("ID and status are required");
  }

  await medicalOrderService.updateStatus(id, status);
  res
    .status(HttpStatusCodes.OK)
    .json(
      new ApiResponse(HttpStatusCodes.OK, "Medical order status updated", "")
    );
}

async function getById(req: IReq, res: IRes) {
  const id: string = req.params.id as string;
  if (!id) {
    throw new ValidationError("ID is required");
  }
  const medicalOrder = await medicalOrderService.getMedicalOrderById(id);
  res
    .status(HttpStatusCodes.OK)
    .json(
      new ApiResponse(
        HttpStatusCodes.OK,
        "Medical order retrieved successfully",
        medicalOrder
      )
    );
}

async function addRecord(req: IReq, res: IRes) {
  const id: string = req.params.id as string;
  if (!id) {
    throw new ValidationError("ID is required");
  }

  const { error, value } = medicalRecordSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  await medicalRecordService.add(value, id, req.user._id);
  res
    .status(HttpStatusCodes.CREATED)
    .json(
      new ApiResponse(HttpStatusCodes.CREATED, "Medical order record added", "")
    );
}

async function getRecords(req: IReq, res: IRes) {
  const id: string = req.params.id as string;
  if (!id) {
    throw new ValidationError("ID is required");
  }
  const queryBuilder = new MedicalRecordQueryBuilder(req.query);
  const records = await medicalRecordService.getRecordsByMedicalOrderId(
    id,
    queryBuilder
  );
  res
    .status(HttpStatusCodes.OK)
    .json(
      new ApiResponse(
        HttpStatusCodes.OK,
        "Medical order records retrieved successfully",
        records
      )
    );
}

async function additionalMedicalDetails(req: IReq, res: IRes) {
  const id: string = req.params.id as string;
  if (!id) {
    throw new ValidationError("ID is required");
  }
  const { error, value } = additionalDetailsSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }
  await medicalOrderService.additionalDetails(id, value);
  res
    .status(HttpStatusCodes.OK)
    .json(
      new ApiResponse(
        HttpStatusCodes.OK,
        "Medical order additional details updated successfully",
        ""
      )
    );
}

export default {
  add,
  get,
  updateStatus,
  getById,
  addRecord,
  getRecords,
  additionalMedicalDetails,
} as const;
