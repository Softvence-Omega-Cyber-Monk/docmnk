import express from "express";
import { upload } from "../../utils/cloudinary";
import { PatientRegistrationController } from "./patientRegistration.controller";

const router = express.Router();

// Use multer to upload multiple reports from form-data
// router.post("/create", upload.single("previousReports"), PatientRegistrationController.registerPatient);

// Use this in your route
router.post(
  "/create",
  upload.fields([
    { name: "previousReport", maxCount: 1 },
    { name: "abiReport", maxCount: 5 },
    { name: "tcpo2Report", maxCount: 5 },
    { name: "monofilamentReport", maxCount: 5 },
    { name: "vibrothermReport", maxCount: 5 },
  ]),
  PatientRegistrationController.registerPatient
);
// Get all patients
router.get("/getAll", PatientRegistrationController.getAllPatients);

// Get single patient by ID
router.get("/:id", PatientRegistrationController.getSinglePatient);

// update medical history
router.put(
  "/updateMedicalHistory/:id",
  upload.fields([{ name: "previousReport" }]),
  PatientRegistrationController.updateMedicalHistory
);
// update lifestyle and substance use
router.put(
  "/updateLifestyleAndSubstanceUse/:id",
  PatientRegistrationController.updateLifestyleAndSubstanceUse
);
// update dietary and activity assessment
router.put(
  "/updateDietaryActivityAssessment/:id",
  PatientRegistrationController.updateDietaryActivityAssessment
);

// update clinical assessment
router.put(
  "/updateClinicalAssessment/:id",
  upload.fields([
    { name: "abiReport", maxCount: 10 },
    { name: "tcpo2Report", maxCount: 10 },
    { name: "monofilamentReport", maxCount: 10 },
    { name: "vibrothermReport", maxCount: 10 },
  ]),
  PatientRegistrationController.updateClinicalAssessment
);

export const PatientRegistrationRoutes = router;
