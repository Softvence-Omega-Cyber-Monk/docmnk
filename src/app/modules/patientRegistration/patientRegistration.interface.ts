// patientRegistration.interface.ts

export type Gender = "Male" | "Female" | "Other";

export type TreatmentStatus =
  | "On Treatment"
  | "Not on Treatment"
  | "Completed"
  | "Unknown";

export interface IMedicalCondition {
  isChecked: boolean; // if the checkbox is selected
  durationYears?: number;
  treatmentStatus?: TreatmentStatus;
  lastCheckupDate?: Date | string;
}

export interface IMedicalHistory {
  diabetesMellitus?: IMedicalCondition;
  hypertension?: IMedicalCondition;
  dyslipidemia?: IMedicalCondition;
  hypothyroid?: IMedicalCondition;
  chronicKidneyDisease?: IMedicalCondition;
  chronicLiverDisease?: IMedicalCondition;
  stroke?: IMedicalCondition;
  cardiovascularDisease?: IMedicalCondition;
  drugAllergies?: string;
  foodAllergies?: string;
  otherComorbidities?: string;
  surgicalHistory?: string;
  currentActiveMedications?: string;
  previousReports?: string[]; // URLs to previouse reports if any are stored in the cloud
}

export interface IPatientRegistration {
  fullName: string;
  gender: Gender;
  dateOfBirth: Date | string;
  age: number;
  phoneNumber: string;
  occupation?: string;
  address: string;

  medicalHistory: IMedicalHistory;
}
