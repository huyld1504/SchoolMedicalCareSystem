import { Document, model, Model, Schema, Types } from "mongoose";

export interface IMedicalEvent extends Document {
  userId: Types.ObjectId,
  status: string,
  type: string,
  level: number,
  description: string,
  dateHappened: Date,
  note: string,
  solution: string,
  studentJoin: [
    {
      studentId: Types.ObjectId;
    }
  ];
}

interface IMedicalEventModel extends Model<IMedicalEvent> { }

const schema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true, enum: ["cấp cứu", "chấn thương", "bệnh"], default: "cấp cứu" },
  status: { type: String, required: true, enum: ["Đã xử lí", "Chờ xử lí", "Đang xử lí"], default: "Chờ xử lí"},
  level: { type: Number, required: true },
  description: { type: String, required: true },
  dateHappened: { type: Date, required: true },
  note: { type: String, default: "" },
  solution: { type: String, default: "" },
  studentJoin: [{studentId: { type: Types.ObjectId, ref: "Child", required: true }}]
}, {
  timestamps: true
});

const MedicalEvent: IMedicalEventModel = model<IMedicalEvent, IMedicalEventModel>("MedicalEvent", schema);
export default MedicalEvent;