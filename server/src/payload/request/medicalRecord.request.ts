interface IMedicalRecordItem {
  medicalOrderDetailId: string;
  quantity: number;
}

export interface IMedicalRecordCreate {
  items: IMedicalRecordItem[];
}
