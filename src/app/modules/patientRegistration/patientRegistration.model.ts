import { Schema, model, Document } from "mongoose";
import { IPatientRegistration, IMedicalCondition, IMedicalHistory } from "./patientRegistration.interface";
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
  },
  {
    timestamps: true,
  }
);

export const PatientRegistration = model<IPatientRegistrationModel>(
  "PatientRegistration",
  PatientRegistrationSchema
);
