import { PatientRegistration } from "./patientRegistration.model";
import { IPatientRegistration } from "./patientRegistration.interface";
import e from "express";

const createPatientRegistration = async (
  payload: IPatientRegistration
) => {
  const patient = await PatientRegistration.create(payload);
  return patient;
};

export const PatientRegistrationService = {
  createPatientRegistration,
};