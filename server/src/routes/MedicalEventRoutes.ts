import { AuthorizationError, ValidationError } from "@src/common/util/util.route-errors";
import { IReq, IRes } from "./common/types";
import MedicalEventService from "@src/services/MedicalEventService";
import { ApiResponse } from "@src/common/util/util.api-response";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { createMedicalEventSchema } from "@src/schemas/medicalEvent.schema";
import { MedicalEventQueryBuilder } from "@src/payload/request/filter/medicalEvent.request";
import ChildService from "@src/services/ChildService";
import roleService from "@src/services/RoleService";

async function create(req: IReq, res: IRes) {
  const { error, value } = createMedicalEventSchema.validate(req.body);
  const userId = req.user._id.toString() as string;

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  await MedicalEventService.createMedicalEvent(value, userId);

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.CREATED,
    "Medical event created successfully",
    null
  );

  res.status(HttpStatusCodes.CREATED).json(response);
}

async function getAll(req: IReq, res: IRes) {
  const queryBuilder = new MedicalEventQueryBuilder(req.query);
  const medicalEvents = await MedicalEventService.getAllMedicalEvents(queryBuilder);

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Medical events retrieved successfully",
    medicalEvents
  );

  res.status(HttpStatusCodes.OK).json(response);
}

async function getById(req: IReq, res: IRes) {
  const eventId = req.params.eventId as string;
  const medicalEvent = await MedicalEventService.getMedicalEventById(eventId);

  if (!medicalEvent) {
    throw new ValidationError("Medical event not found.");
  }

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Medical event retrieved successfully",
    medicalEvent
  );

  res.status(HttpStatusCodes.OK).json(response);
}

async function getByStudentId(req: IReq, res: IRes) {
  const studentId = req.params.studentId as string;
  const userId = req.user._id.toString() as string;

  const role = await roleService.getById(req.user.roleId.toString());
  const student = await ChildService.getById(studentId);
  if (student?.userId.toString() !== userId && role?.name === "parent") {
    throw new AuthorizationError("You cannot access this student's medical events.");
  }

  const queryBuilder = new MedicalEventQueryBuilder(req.query);
  const medicalEvents = await MedicalEventService.getMedicalEventsByStudentId(studentId, queryBuilder);

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Medical events for student retrieved successfully",
    medicalEvents
  );

  res.status(HttpStatusCodes.OK).json(response);
}

async function updateById(req: IReq, res: IRes) {
  const eventId = req.params.eventId as string;
  const { error, value } = createMedicalEventSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const updatedEvent = await MedicalEventService.updateMedicalEvent(eventId, value);

  if (!updatedEvent) {
    throw new ValidationError("Medical event not found.");
  }

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Medical event updated successfully",
    updatedEvent
  );

  res.status(HttpStatusCodes.OK).json(response);
}

async function deleteById(req: IReq, res: IRes) {
  const eventId = req.params.eventId as string;
  const deletedEvent = await MedicalEventService.deleteMedicalEvent(eventId);

  if (!deletedEvent) {
    throw new ValidationError("Medical event not found.");
  }

  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Medical event deleted successfully",
    deletedEvent
  );

  res.status(HttpStatusCodes.OK).json(response);
}

export default {
  create,
  getAll,
  getById,
  getByStudentId,
  updateById,
  deleteById
} as const;