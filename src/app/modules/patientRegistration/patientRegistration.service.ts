import { PatientRegistration } from "./patientRegistration.model";
import { IPatientRegistration } from "./patientRegistration.interface";
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

export const PatientRegistrationService = {
  createPatientRegistration,
  getSinglePatient,
};