import express from "express";
import { upload } from "../../utils/cloudinary";
import { PatientRegistrationController } from "./patientRegistration.controller";

const router = express.Router();

// Use multer to upload multiple reports from form-data
// router.post("/create", upload.single("previousReports"), PatientRegistrationController.registerPatient);

// Use this in your route
router.post(
  '/create',
  upload.fields([
    { name: 'previousReport', maxCount: 1 },
    { name: 'abiReport', maxCount: 5 },
    { name: 'tcpo2Report', maxCount: 5 },
    { name: 'monofilamentReport', maxCount: 5 },
    { name: 'vibrothermReport', maxCount: 5 }
  ]),
  PatientRegistrationController.registerPatient
);


export const PatientRegistrationRoutes = router;
