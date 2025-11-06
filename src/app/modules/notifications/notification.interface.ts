// Recipient types
export enum RecipientType {
  ALL_PATIENTS_WITH_UPCOMING_APPOINTMENTS = 'ALL_PATIENTS_WITH_UPCOMING_APPOINTMENTS',
  SPECIFIC_PATIENTS = 'SPECIFIC_PATIENTS',
  PATIENTS_BY_CONDITION = 'PATIENTS_BY_CONDITION',
  ALL_PATIENTS = 'ALL_PATIENTS'
}

// Notification status
export enum NotificationStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  FAILED = 'FAILED'
}

// Recipient filter options
export interface IRecipientFilter {
  appointmentDateRange?: {
    start: Date;
    end: Date;
  };
  conditions?: string[];
  locations?: string[];
  providers?: string[];
}

// Recipient configuration
export interface IRecipient {
  type: RecipientType;
  filters?: IRecipientFilter;
  patientIds?: string[]; // For SPECIFIC_PATIENTS
}

// Base Notification interface
export interface INotification {
  title: string;
  recipients: IRecipient;
  subject: string;
  message: string;
  status: NotificationStatus;
  scheduledFor?: Date;
  sentAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
