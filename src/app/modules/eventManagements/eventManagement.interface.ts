export interface ICamp {
  _id?: string;
  campName: string;
  location: string;
  status: "Ongoing" | "Upcoming" | "Completed";
  assignAdmin: string;
  avgTime: number;
  patientToday?: number;
  completion?: number;
  totalEnrolled?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICampCreate {
  campName: string;
  location: string;
  status: "Ongoing" | "Upcoming" | "Completed";
  assignAdmin: string;
  avgTime: number;
}

export interface ICampUpdate {
  campName?: string;
  location?: string;
  status: "Ongoing" | "Upcoming" | "Completed";
  assignAdmin?: string;
  avgTime: number;
}
