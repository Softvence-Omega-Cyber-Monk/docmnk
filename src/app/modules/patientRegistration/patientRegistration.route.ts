import express from "express";
import { upload } from "../../utils/cloudinary";
import { PatientRegistrationController } from "./patientRegistration.controller";

const router = express.Router();

// Use multer to upload multiple reports from form-data
router.post("/create", upload.single("previousReports"), PatientRegistrationController.registerPatient);

export const PatientRegistrationRoutes = router;
