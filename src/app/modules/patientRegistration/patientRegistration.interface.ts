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
  diabetesMellitus: IMedicalCondition;
  hypertension: IMedicalCondition;
  dyslipidemia: IMedicalCondition;
  hypothyroid: IMedicalCondition;
  hyperthyroid: IMedicalCondition;
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
