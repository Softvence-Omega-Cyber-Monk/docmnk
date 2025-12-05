export interface IReport {
  patientId: string;
  patientName?: string;
  campId?: string;
  campName?: string;
  reports: string[]; // Cloudinary URLs
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
