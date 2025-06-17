import { Types } from "mongoose";

export interface IMedicalOrderWithDetailsCreate {
  medicalOrder: {
    ChildId: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    note?: string;
  };
  medicalOrderDetails: IMedicalOrderDetailCreate[];
}

export interface IMedicalOrderDetailCreate {
  _id?: Types.ObjectId;
  MedicalOrderId?: Types.ObjectId;
  medicineName: string;
  dosage: string;
  type: string;
  time: string;
  note?: string;
  quantity: number;
}
export interface IMedicalOrderDetailAdditional {
  medicalOrderDetails: IMedicalOrderDetailCreate[];
}
