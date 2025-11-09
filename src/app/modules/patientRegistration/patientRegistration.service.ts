import { PatientRegistration } from "./patientRegistration.model";
import { IClinicalAssessment, IDietaryActivityAssessment, IPatientRegistration } from "./patientRegistration.interface";
import e from "express";

const createPatientRegistration = async (
  payload: IPatientRegistration
) => {
  const patient = await PatientRegistration.create(payload);
  return patient;
};

const getSinglePatient = async (id: string) => {
  const patient = await PatientRegistration.findById(id);

  if (!patient) {
    throw new Error("Patient not found");
  } 

  return patient;
};

// ✅ Get all patients
const getAllPatients = async () => {
  const patients = await PatientRegistration.find();
  return patients;
};

// Update medical history
const updateMedicalHistory = async (id: string, updateData: any) => {
  const patient = await PatientRegistration.findByIdAndUpdate(
    id,
    { $set: { medicalHistory: updateData } },
    { new: true }
  );
  if (!patient) {
    throw new Error("Patient not found");
  }
  return patient;
};

// update lifestyle modification
const updateLifestyleAndSubstanceUse = async (id: string, lifestyleData: any) => {
  const patient = await PatientRegistration.findById(id);
  if (!patient) {
    throw new Error("Patient not found");
  }

  patient.lifestyleAndSubstanceUse = {
    ...patient.lifestyleAndSubstanceUse,
    ...lifestyleData,
  };

  await patient.save();
  return patient;
};

// Update dietaryActivityAssessment
const updateDietaryActivityAssessmentService = async (
  patientId: string,
  dietaryData: IDietaryActivityAssessment
): Promise<IPatientRegistration | null> => {
  const updatedPatient = await PatientRegistration.findByIdAndUpdate(
    patientId,
    { dietaryActivityAssessment: dietaryData },
    { new: true }
  );
  return updatedPatient;
};

const updateClinicalAssessmentService = async (
  patientId: string,
  clinicalData: IClinicalAssessment
): Promise<IPatientRegistration | null> => {
  const updatedPatient = await PatientRegistration.findByIdAndUpdate(
    patientId,
    { clinicalAssessment: clinicalData },
    { new: true }
  );

  return updatedPatient;
};


export const PatientRegistrationService = {
  createPatientRegistration,
  getSinglePatient,
  getAllPatients,
  updateMedicalHistory,
  updateLifestyleAndSubstanceUse,
  updateDietaryActivityAssessmentService,
  updateClinicalAssessmentService,
};