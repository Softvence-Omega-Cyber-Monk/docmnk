export interface IpatientManagement {
  patientId: string;
  patientName?: string;
  status: 'Wating for Registration' | 'Waiting for Vitals' | 'Waiting for Consultation' | 'Screening Complete';
  waitTime: string;
  complianceStatus?: 'Complete' | 'Pending';
  createdAt?: Date;
  updatedAt?: Date;
}