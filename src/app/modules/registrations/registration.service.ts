import mongoose from "mongoose";
import { Account_Model } from "../auth/auth.schema";
import { PatientManagementModel } from "../patientManagements/patientManagement.model";
import { getPatientModel } from "./registration.model";

// export const createPatientRegistration = async (payload: any) => {
//   const PatientModel = await getPatientModel();
//   const patient = new PatientModel(payload);
//   console.log("patient form", patient);
//   return await patient.save();
// };

export const createPatientRegistration = async (payload: any) => {
  const PatientModel = await getPatientModel();

  console.log("Incoming payload:", payload);

  // 1️⃣ Create patient registration document
  const patient = new PatientModel(payload);
  const savedPatient = await patient.save();

  // 2️⃣ Update Auth model → alreadyFilledRegistrationForm = true
  if (payload.userId) {
    console.log("Updating user:", payload.userId);

    const updatedAccount = await Account_Model.findByIdAndUpdate(
      new mongoose.Types.ObjectId(payload.userId.trim()),  // convert to ObjectId
      { alreadyFilledRegistrationForm: true },
      { new: true }
    );

    console.log("Updated Account:", updatedAccount);
  }

  return savedPatient;
};

export const getAllPatients = async () => {
  const PatientModel = await getPatientModel();
  return await PatientModel.find();
};

export const getPatientById = async (userId: string) => {
  const PatientModel = await getPatientModel();
  return await PatientModel.findById(userId);
};