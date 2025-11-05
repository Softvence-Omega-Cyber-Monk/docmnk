import { Router } from "express";
import { PatientManagementController } from "./patientManagement.controller";

const router = Router();

// ✅ Create patient management record
router.post("/create", PatientManagementController.createPatientManagement);

// ✅ Get all patient management records
router.get("/", PatientManagementController.getAllPatientManagement);

// ✅ Get single patient management record by ID
router.get("/:id", PatientManagementController.getPatientManagementById);

// ✅ Update patient management record by ID
router.put("/:id", PatientManagementController.updatePatientManagement);

export const patientManagementRoute = router;
