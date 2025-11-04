// patientRegistration.interface.ts

export type Gender = "Male" | "Female" | "Other";

export type TreatmentStatus =
  | "On Treatment"
  | "Not on Treatment"
  | "Completed"
  | "Unknown";

export type SmokingStatus = "Current Smoker" | "Former Smoker" | "Never Smoked";

export type TobaccoType =
  | "Cigarettes"
  | "Beedis"
  | "Chewing Tobacco"
  | "Khatri"
  | "Other";

export type BetelNutType = "Betel Nut" | "Pan" | "Betel Leaf" | "Other";

export interface ISmokingHistory {
  status: SmokingStatus;
  cigarettes?: {
    numberOfCigarettesPerDay?: number;
    yearsSmoked?: number;
    packYears?: number;
  };
  beedis?: {
    numberOfBeedisPerDay?: number;
    yearsSmoked?: number;
  };
}

export interface ITobaccoChewing {
  type: TobaccoType;
  brand?: string;
  amountPerDay?: number;
  yearsOfUse?: number;
}

export interface IBetelNutUse {
  type: BetelNutType;
  amountPerDay?: number;
  yearsOfUse?: number;
}

export interface IAlcoholUse {
  unitsPerWeek?: number;
}

export interface ISubstanceUse {
  otherSubstances?: {
    name: string;
    frequency?: string;
    yearsOfUse?: number;
    route?: string;
    treatmentStatus?: TreatmentStatus;
  }[];
}

export interface ILifestyleAndSubstanceUse {
  smokingHistory?: ISmokingHistory;
  tobaccoChewing?: ITobaccoChewing[];
  betelNutUse?: IBetelNutUse[];
  alcoholUse?: IAlcoholUse;
  substanceUse?: ISubstanceUse;
}

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
  lifestyleAndSubstanceUse: ILifestyleAndSubstanceUse;
}
