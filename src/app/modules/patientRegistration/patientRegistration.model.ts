import { Schema, model, Document } from "mongoose";
import { IPatientRegistration, IMedicalCondition, IMedicalHistory, ISmokingHistory, ITobaccoChewing, IBetelNutUse, IAlcoholUse, ISubstanceUse, ILifestyleAndSubstanceUse } from "./patientRegistration.interface";
import { fa } from "zod/v4/locales";

export interface IPatientRegistrationModel extends IPatientRegistration, Document {}

// Sub-schema for medical condition
const MedicalConditionSchema = new Schema<IMedicalCondition>(
  {
    isChecked: { type: Boolean, required: true },
    durationYears: { type: Number },
    treatmentStatus: {
      type: String,
      enum: ["On Treatment", "Not on Treatment", "Completed", "Unknown"],
    },
    lastCheckupDate: { type: Date },
  },
  { _id: false }
);

// Sub-schema for medical history
const MedicalHistorySchema = new Schema<IMedicalHistory>(
  {
    diabetesMellitus: { type: MedicalConditionSchema},
    hypertension: { type: MedicalConditionSchema },
    dyslipidemia: { type: MedicalConditionSchema},
    hypothyroid: { type: MedicalConditionSchema},
    chronicKidneyDisease: { type: MedicalConditionSchema },
    chronicLiverDisease: { type: MedicalConditionSchema },
    stroke: { type: MedicalConditionSchema },
    cardiovascularDisease: { type: MedicalConditionSchema },
    drugAllergies: { type: String },
    foodAllergies: { type: String },
    otherComorbidities: { type: String },
    surgicalHistory: { type: String },
    currentActiveMedications: { type: String },
    previousReports: [{ type: String }],
  },
  { _id: false, strict: false }
);

// Sub-schema for smoking history
const SmokingHistorySchema = new Schema<ISmokingHistory>(
  {
    status: {
      type: String,
      enum: ["Current Smoker", "Former Smoker", "Never Smoked"],
      required: true
    },
    cigarettes: {
      numberOfCigarettesPerDay: { type: Number },
      yearsSmoked: { type: Number },
      packYears: { type: Number }
    },
    beedis: {
      numberOfBeedisPerDay: { type: Number },
      yearsSmoked: { type: Number }
    }
  },
  { _id: false }
);

// Sub-schema for tobacco chewing
const TobaccoChewingSchema = new Schema<ITobaccoChewing>(
  {
    type: {
      type: String,
      enum: ["Cigarettes", "Beedis", "Chewing Tobacco", "Khatri", "Other"],
      required: true
    },
    brand: { type: String },
    amountPerDay: { type: Number },
    yearsOfUse: { type: Number }
  },
  { _id: false }
);

// Sub-schema for betel nut use
const BetelNutUseSchema = new Schema<IBetelNutUse>(
  {
    type: {
      type: String,
      enum: ["Betel Nut", "Pan", "Betel Leaf", "Other"],
      required: true
    },
    amountPerDay: { type: Number },
    yearsOfUse: { type: Number }
  },
  { _id: false }
);

// Sub-schema for alcohol use
const AlcoholUseSchema = new Schema<IAlcoholUse>(
  {
    unitsPerWeek: { type: Number }
  },
  { _id: false }
);

// Sub-schema for other substances
const OtherSubstanceSchema = new Schema(
  {
    name: { type: String, required: true },
    frequency: { type: String },
    yearsOfUse: { type: Number },
    route: { type: String },
    treatmentStatus: {
      type: String,
      enum: ["On Treatment", "Not on Treatment", "Completed", "Unknown"]
    }
  },
  { _id: false }
);

// Sub-schema for substance use
const SubstanceUseSchema = new Schema<ISubstanceUse>(
  {
    otherSubstances: [OtherSubstanceSchema]
  },
  { _id: false }
);

// Sub-schema for lifestyle and substance use
const LifestyleAndSubstanceUseSchema = new Schema<ILifestyleAndSubstanceUse>(
  {
    smokingHistory: { type: SmokingHistorySchema },
    tobaccoChewing: [TobaccoChewingSchema],
    betelNutUse: [BetelNutUseSchema],
    alcoholUse: { type: AlcoholUseSchema },
    substanceUse: { type: SubstanceUseSchema }
  },
  { _id: false }
);

// Main schema for patient registration
const PatientRegistrationSchema = new Schema<IPatientRegistrationModel>(
  {
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    occupation: { type: String },
    address: { type: String, required: true },
    medicalHistory: { type: MedicalHistorySchema, required: true },
    lifestyleAndSubstanceUse: { type: LifestyleAndSubstanceUseSchema, required: true },
  },
  {
    timestamps: true,
  }
);

export const PatientRegistration = model<IPatientRegistrationModel>(
  "PatientRegistration",
  PatientRegistrationSchema
);
