import { PatientManagementModel } from "./patientManagement.model";
import { IpatientManagement } from "./patientManagement.interface";
import { Parser } from "json2csv"; // ✅ add this import
import { PatientRegistration } from "../patientRegistration/patientRegistration.model";

// ✅ Create a patient management record
const createPatientManagement = async (payload: IpatientManagement) => {
  const patient = await PatientManagementModel.create(payload);
  if (payload.patientId) {
    await PatientRegistration.findByIdAndUpdate(
      payload.patientId,
      {status: payload.status},
      {new: true}
    );
  }
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

  if (patient.patientId) {
    await PatientRegistration.findByIdAndUpdate(
      patient.patientId,
      {status: patient.status},
      {new: true}
    );
  }

  return patient;
};

// ✅ Get all compliance data
const getAllCompliance = async () => {
  const records = await PatientManagementModel.find().sort({ createdAt: -1 });

  // compute complianceStatus but don't update DB
  const formatted = records.map((p) => ({
    ...p.toObject(),
    complianceStatus: p.status === "Screening Complete" ? "Complete" : "Pending",
  }));

  return formatted;
};

// ✅ Get single compliance by ID
const getSingleCompliance = async (id: string) => {
  const record = await PatientManagementModel.findById(id);

  if (!record) {
    throw new Error("Compliance record not found");
  }

  return {
    ...record.toObject(),
    complianceStatus: record.status === "Screening Complete" ? "Complete" : "Pending",
  };
}

// Update comlianceStatus based on patientManagementId
const updateComplianceStatus = async (
  id: string,
  complianceStatus: "Complete" | "Pending"
) => {
  const record = await PatientManagementModel.findById(id);

  if (!record) throw new Error("Patient management record not found");

  // ✅ Update DB
  record.complianceStatus = complianceStatus;
  record.status = complianceStatus === "Complete" ? "Screening Complete" : record.status;
  await record.save(); // <-- This saves to MongoDB

  return record;
};

  // ✅ Export all patient data as CSV
 const exportAllPatientDataCsv = async () => {
  const patients = await PatientManagementModel.find().lean();
  if (!patients || patients.length === 0) return "";

  const fields = ["_id", "patientId", "patientName", "waitTime", "complianceStatus"];
  const parser = new Parser({ fields });
  const csv = parser.parse(patients);
  return csv;
};


// ✅ Single exported service object
export const PatientManagementService = {
  createPatientManagement,
  getAllPatientManagement,
  getPatientManagementById,
  updatePatientManagement,
  getAllCompliance,
  getSingleCompliance,
  updateComplianceStatus,
  exportAllPatientDataCsv,
};
