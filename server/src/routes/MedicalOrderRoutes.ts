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
    "Tạo hồ sơ y tế thành công"
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
        "Lấy danh sách đơn thuốc thành công",
        children
      )
    );
}

async function updateStatus(req: IReq, res: IRes) {
  const id: string = req.params.id as string;
  const status: string = req.body.status as string;
  const note: string = req.body.note as string;

  if (!id || !status) {
    throw new ValidationError("Yêu cầu ID và trạng thái");
  }

  await medicalOrderService.updateStatus(id, status, note);
  res
    .status(HttpStatusCodes.OK)
    .json(
      new ApiResponse(HttpStatusCodes.OK, "Cập nhật trạng thái đơn thuốc thành công", "")
    );
}

async function getById(req: IReq, res: IRes) {
  const id: string = req.params.id as string;
  if (!id) {
    throw new ValidationError("Yêu cầu ID");
  }
  const medicalOrder = await medicalOrderService.getMedicalOrderById(id);
  res
    .status(HttpStatusCodes.OK)
    .json(
      new ApiResponse(
        HttpStatusCodes.OK,
        "Lấy thông tin đơn thuốc thành công",
        medicalOrder
      )
    );
}

async function addRecord(req: IReq, res: IRes) {
  const id: string = req.params.id as string;
  if (!id) {
    throw new ValidationError("Yêu cầu ID");
  }

  const { error, value } = medicalRecordSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  await medicalRecordService.add(value, id, req.user._id);
  res
    .status(HttpStatusCodes.CREATED)
    .json(
      new ApiResponse(HttpStatusCodes.CREATED, "Thêm hồ sơ đơn thuốc thành công", "")
    );
}

async function getRecords(req: IReq, res: IRes) {
  const id: string = req.params.id as string;
  if (!id) {
    throw new ValidationError("Yêu cầu ID");
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
        "Lấy hồ sơ đơn thuốc thành công",
        records
      )
    );
}

async function additionalMedicalDetails(req: IReq, res: IRes) {
  const id: string = req.params.id as string;
  if (!id) {
    throw new ValidationError("Yêu cầu ID");
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
        "Cập nhật thông tin bổ sung đơn thuốc thành công",
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
