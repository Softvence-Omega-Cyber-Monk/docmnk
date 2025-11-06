import { Request, Response } from "express";
import { PatientManagementService } from "./patientManagement.service";
import { PatientRegistration } from "../patientRegistration/patientRegistration.model";
import { PatientManagementModel } from "./patientManagement.model";

// ✅ Create patient management
const createPatientManagement = async (req: Request, res: Response) => {
  try {
    const { patientId, status, waitTime } = req.body;

    // Check if record already exists
    const existing = await PatientManagementModel.findOne({ patientId });
    

    // Fetch patient from PatientRegistration
    const patientRecord = await PatientRegistration.findById(patientId).select(
      "fullName"
    );
    if (!patientRecord) {
      return res
        .status(404)
        .json({ message: "Patient not found in registration" });
    }

    // Create patient management record with name populated
    const patientManagement =
      await PatientManagementService.createPatientManagement({
        patientId,
        patientName: patientRecord.fullName,
        status,
        waitTime,
      });

    res.status(201).json(patientManagement);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || "Error creating patient management" });
  }
};
// ✅ Get all patient management records
const getAllPatientManagement = async (_req: Request, res: Response) => {
  try {
    const patients = await PatientManagementService.getAllPatientManagement();
    res.json(patients);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || "Error fetching patients" });
  }
};

// ✅ Get single patient management record by ID
const getPatientManagementById = async (req: Request, res: Response) => {
  try {
    const patient = await PatientManagementService.getPatientManagementById(
      req.params.id
    );
    res.json(patient);
  } catch (error: any) {
    console.error(error);
    res.status(404).json({ message: error.message || "Patient not found" });
  }
};

// ✅ Update patient management record
const updatePatientManagement = async (req: Request, res: Response) => {
  try {
    const patient = await PatientManagementService.updatePatientManagement(
      req.params.id,
      req.body
    );
    res.json(patient);
  } catch (error: any) {
    console.error(error);
    res.status(404).json({ message: error.message || "Patient not found" });
  }
};

// ✅ Single exported controller object
export const PatientManagementController = {
  createPatientManagement,
  getAllPatientManagement,
  getPatientManagementById,
  updatePatientManagement,
};
