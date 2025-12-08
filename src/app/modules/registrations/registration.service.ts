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

  // 1️⃣ Create patient registration
  const patient = new PatientModel(payload);
  const savedPatient = await patient.save();

  // 2️⃣ Update Auth model → alreadyFilledRegistrationForm: true
  if (payload.userId) {
    await Account_Model.findByIdAndUpdate(
      payload.userId,
      { alreadyFilledRegistrationForm: true },
      { new: true }
    );
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