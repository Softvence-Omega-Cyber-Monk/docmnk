import { PatientManagementModel } from "./patientManagement.model";
import { IpatientManagement } from "./patientManagement.interface";

// ✅ Create a patient management record
const createPatientManagement = async (payload: IpatientManagement) => {
  const patient = await PatientManagementModel.create(payload);
  return patient;
};

// ✅ Get all patient management records
const getAllPatientManagement = async () => {
  const patients = await PatientManagementModel.find().sort({ createdAt: -1 });
  return patients;
};

// ✅ Get a single patient management record by ID
const getPatientManagementById = async (id: string) => {
  const patient = await PatientManagementModel.findById(id);

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
};

// ✅ Update patient management record by ID
const updatePatientManagement = async (id: string, updateData: Partial<IpatientManagement>) => {
  const patient = await PatientManagementModel.findByIdAndUpdate(id, updateData, { new: true });

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
};

// ✅ Single exported service object
export const PatientManagementService = {
  createPatientManagement,
  getAllPatientManagement,
  getPatientManagementById,
  updatePatientManagement,
};
