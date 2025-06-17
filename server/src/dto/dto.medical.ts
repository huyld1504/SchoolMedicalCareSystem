import { IMedicalRecord } from "@src/models/MedicalRecord";
import { IMedicalRecordItem } from "@src/models/MedicalRecordItem";

interface MedicalRecordDto extends IMedicalRecord {
  items: IMedicalRecordItem[];
}
export { MedicalRecordDto };
