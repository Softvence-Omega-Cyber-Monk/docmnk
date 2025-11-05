export interface ICamp {
  _id?: string;
  campName: string;
  location: string;
  status: 'Ongoing' | 'Upcoming' | 'Completed';
  assignAdmin: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICampCreate {
  campName: string;
  location: string;
  status: 'Ongoing' | 'Upcoming' | 'Completed';
  assignAdmin: string;
}

export interface ICampUpdate {
  campName?: string;
  location?: string;
  status: 'Ongoing' | 'Upcoming' | 'Completed';
  assignAdmin?: string;
}