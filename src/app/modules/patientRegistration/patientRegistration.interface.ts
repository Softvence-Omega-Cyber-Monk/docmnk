// // patientRegistration.interface.ts

// export type Gender = "Male" | "Female" | "Other";

// export type TreatmentStatus =
//   | "On Treatment"
//   | "Not on Treatment"
//   | "Completed"
//   | "Unknown";

// export type SmokingStatus = "Current Smoker" | "Former Smoker" | "Never Smoked";

// export type TobaccoType =
//   | "Cigarettes"
//   | "Beedis"
//   | "Chewing Tobacco"
//   | "Khatri"
//   | "Other";

// export type BetelNutType = "Betel Nut" | "Pan" | "Betel Leaf" | "Other";

// export type DietPreference = "Vegetarian" | "Non-Vegetarian" | "Vegan" | "Other";

// export type PhysicalActivityLevel =
//   | "Sedentary"
//   | "Lightly Active"
//   | "Moderately Active"
//   | "Very Active"
//   | "Extremely Active";

// export interface ISmokingHistory {
//   status: SmokingStatus;
//   cigarettes?: {
//     numberOfCigarettesPerDay?: number;
//     yearsSmoked?: number;
//     packYears?: number;
//   };
//   beedis?: {
//     numberOfBeedisPerDay?: number;
//     yearsSmoked?: number;
//   };
// }

// export interface ITobaccoChewing {
//   type: TobaccoType;
//   brand?: string;
//   amountPerDay?: number;
//   yearsOfUse?: number;
// }

// export interface IBetelNutUse {
//   type: BetelNutType;
//   amountPerDay?: number;
//   yearsOfUse?: number;
// }

// export interface IAlcoholUse {
//   unitsPerWeek?: number;
// }

// export interface ISubstanceUse {
//   otherSubstances?: {
//     name: string;
//     frequency?: string;
//     yearsOfUse?: number;
//     route?: string;
//     treatmentStatus?: TreatmentStatus;
//   }[];
// }

// export interface ILifestyleAndSubstanceUse {
//   smokingHistory?: ISmokingHistory;
//   tobaccoChewing?: ITobaccoChewing[];
//   betelNutUse?: IBetelNutUse[];
//   alcoholUse?: IAlcoholUse;
//   substanceUse?: ISubstanceUse;
// }

// export interface IDietaryActivityAssessment {
//   dietPreference?: DietPreference;
//   foodAllergies?: string[]; // Array of food allergies
//   medicationAllergies?: string[]; // Array of medication allergies
//   currentDietary?: {
//     typicalMeals?: string; // Description of typical meals
//     eatingHabits?: string; // Additional eating habit notes
//   };
//   physicalActivity?: {
//     activityLevel?: PhysicalActivityLevel;
//     sleepHoursPerNight?: number;
//     hasMobilityLimitations?: boolean;
//     interestedInGuidedExercise?: boolean;
//     exerciseFrequency?: string; // e.g., "3 times per week"
//     exerciseType?: string; // e.g., "Walking, Swimming"
//   };
// }

// export interface IMedicalCondition {
//   isChecked: boolean; // if the checkbox is selected
//   durationYears?: number;
//   treatmentStatus?: TreatmentStatus;
//   lastCheckupDate?: Date | string;
// }

// export interface IMedicalHistory {
//   diabetesMellitus?: IMedicalCondition;
//   hypertension?: IMedicalCondition;
//   dyslipidemia?: IMedicalCondition;
//   hypothyroid?: IMedicalCondition;
//   chronicKidneyDisease?: IMedicalCondition;
//   chronicLiverDisease?: IMedicalCondition;
//   stroke?: IMedicalCondition;
//   cardiovascularDisease?: IMedicalCondition;
//   drugAllergies?: string;
//   foodAllergies?: string;
//   otherComorbidities?: string;
//   surgicalHistory?: string;
//   currentActiveMedications?: string;
//   previousReports?: string[]; // URLs to previouse reports if any are stored in the cloud
// }

// export interface IPatientRegistration {
//   fullName: string;
//   gender: Gender;
//   dateOfBirth: Date | string;
//   age: number;
//   phoneNumber: string;
//   occupation?: string;
//   address: string;

//   medicalHistory: IMedicalHistory;
//   lifestyleAndSubstanceUse?: ILifestyleAndSubstanceUse;
//   dietaryActivityAssessment?: IDietaryActivityAssessment;
// }
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

export type DietPreference = "Vegetarian" | "Non-Vegetarian" | "Vegan" | "Other";

export type PhysicalActivityLevel =
  | "Sedentary"
  | "Lightly Active"
  | "Moderately Active"
  | "Very Active"
  | "Extremely Active";

export type AffectedLimb = "Both" | "Right" | "Left";
export type PulseStatus = "Normal" | "Absent" | "Diminished" | "Bounding";
export type SkinCondition = "Normal" | "Thickened" | "Ingrown" | "Fungal Infection";
export type LymphStage = "Stage 0" | "Stage I" | "Stage II" | "Stage III";

// Smoking History Interfaces
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

// Dietary & Activity Assessment Interfaces
export interface IDietaryActivityAssessment {
  dietPreference?: DietPreference;
  foodAllergies?: string[];
  medicationAllergies?: string[];
  currentDietary?: {
    typicalMeals?: string;
    eatingHabits?: string;
  };
  physicalActivity?: {
    activityLevel?: PhysicalActivityLevel;
    sleepHoursPerNight?: number;
    hasMobilityLimitations?: boolean;
    interestedInGuidedExercise?: boolean;
    exerciseFrequency?: string;
    exerciseType?: string;
  };
}

// Clinical Assessment Interfaces
export interface IVitalsBiometrics {
  weight?: number; // kg
  height?: number; // cm
  bmi?: number; // calculated
  temperature?: number; // °C
  bpSystolic?: number;
  bpDiastolic?: number;
  heartRate?: number;
  spO2?: number; // %
  rbs?: number; // mg/dL
}

export interface IArterialAssessment {
  affectedLimb?: AffectedLimb;
  symptoms?: {
    restPain?: boolean;
    claudication?: boolean;
  };
  skinChanges?: {
    pallor?: boolean;
    rubor?: boolean;
    cyanosis?: boolean;
    coolness?: boolean;
    atrophy?: boolean;
    hairLoss?: boolean;
    nailChanges?: boolean;
  };
  peripheralPulses?: {
    right?: {
      femoral?: PulseStatus;
      popliteal?: PulseStatus;
      dorsalisPedis?: PulseStatus;
      posteriorTibial?: PulseStatus;
    };
    left?: {
      femoral?: PulseStatus;
      popliteal?: PulseStatus;
      dorsalisPedis?: PulseStatus;
      posteriorTibial?: PulseStatus;
    };
  };
  ankleBrachialIndex?: {
    right?: number;
    left?: number;
  };
  abiTestPerformed?: boolean;
}

export interface IVenousAssessment {
  varicoseVeinsPresent?: boolean;
  edemaPresent?: boolean;
  skinChanges?: {
    hyperpigmentation?: boolean;
    lipodermatosclerosis?: boolean;
    venousUlcerPresent?: boolean;
    eczema?: boolean;
    atrophicBlanche?: boolean;
  };
  chronicVenousInsufficiency?: boolean;
}

export interface ILymphaticAssessment {
  lymphedemaPresent?: boolean;
  limbCircumference?: {
    right?: {
      thigh?: number; // cm
      calf?: number; // cm
      ankle?: number; // cm
    };
    left?: {
      thigh?: number; // cm
      calf?: number; // cm
      ankle?: number; // cm
    };
  };
  stemmersSign?: {
    right?: boolean;
    left?: boolean;
  };
  skinChanges?: {
    thickening?: boolean;
    hyperkeratosis?: boolean;
    papillomatosis?: boolean;
    fibrosis?: boolean;
  };
  recurrentInfections?: boolean;
  otherFindings?: {
    otherDeformities?: string;
    callusHyperkeratosis?: boolean;
    lymphorrhea?: boolean;
  };
  lymphoedemaStage?: LymphStage;
}

export interface ISensoryTesting {
  monofilamentTestPerformed?: boolean;
  vibrationSense?: boolean;
  proprioceptionTest?: boolean;
  hotColdTest?: boolean;
  proprioception?: boolean;
  motorWeakness?: boolean;
}

export interface IFootAssessment {
  deformities?: {
    hammerToes?: boolean;
    clawToes?: boolean;
    charcotFoot?: boolean;
    bunions?: boolean;
    plantarMetatarsal?: boolean;
  };
  otherDeformities?: string;
  nailCondition?: SkinCondition;
  callusHyperkeratosis?: boolean;
  activeUlcer?: boolean;
  previousUlceration?: boolean;
  appropriateFootwear?: boolean;
}

export interface IInvestigations {
  hba1c?: number; // %
  toePressure?: number; // mmHg
  tcpo2?: number; // mmHg
  reports?: {
    abiReport?: string[]; // file URLs
    tcpo2Report?: string[]; // file URLs
    monofilamentReport?: string[]; // file URLs
    vibrothermReport?: string[]; // file URLs
  };
}

export interface IUlcerAssessment {
  ulcerPresent?: boolean;
  details?: {
    location?: string;
    size?: string;
    depth?: string;
    woundBed?: string;
    exudate?: string;
    surroundingSkin?: string;
  };
}

export interface IClinicalAssessment {
  presentingComplaint?: string;
  vitalsBiometrics?: IVitalsBiometrics;
  arterialAssessment?: IArterialAssessment;
  venousAssessment?: IVenousAssessment;
  lymphaticAssessment?: ILymphaticAssessment;
  sensoryTesting?: ISensoryTesting;
  footAssessment?: IFootAssessment;
  ulcerAssessment?: IUlcerAssessment;
  investigations?: IInvestigations;
}

// Medical History Interfaces
export interface IMedicalCondition {
  isChecked: boolean;
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
  previousReports?: string[];
}

// Main Patient Registration Interface
export interface IPatientRegistration {
  // Basic Information
  fullName: string;
  gender: Gender;
  dateOfBirth: Date | string;
  age: number;
  phoneNumber: string;
  email?: string;
  occupation?: string;
  address: string;

  // Medical & Lifestyle Sections
  medicalHistory: IMedicalHistory;
  lifestyleAndSubstanceUse?: ILifestyleAndSubstanceUse;
  dietaryActivityAssessment?: IDietaryActivityAssessment;
  clinicalAssessment?: IClinicalAssessment;
}