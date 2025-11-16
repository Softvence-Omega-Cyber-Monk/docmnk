// import express from "express";
// import { upload } from "../../utils/cloudinary";
// import { PatientRegistrationController } from "./patientRegistration.controller";

// const router = express.Router();

// // Use multer to upload multiple reports from form-data
// // router.post("/create", upload.single("previousReports"), PatientRegistrationController.registerPatient);

// // Use this in your route
// router.post(
//   "/create",
//   upload.fields([
//     { name: "previousReport", maxCount: 1 },
//     { name: "abiReport", maxCount: 5 },
//     { name: "tcpo2Report", maxCount: 5 },
//     { name: "monofilamentReport", maxCount: 5 },
//     { name: "vibrothermReport", maxCount: 5 },
//   ]),
//   PatientRegistrationController.registerPatient
// );
// // Get all patients
// router.get("/getAll", PatientRegistrationController.getAllPatients);

// // Get single patient by ID
// router.get("/:id", PatientRegistrationController.getSinglePatient);

// // update medical history
// router.put(
//   "/updateMedicalHistory/:id",
//   upload.fields([{ name: "previousReport" }]),
//   PatientRegistrationController.updateMedicalHistory
// );
// // update lifestyle and substance use
// router.put(
//   "/updateLifestyleAndSubstanceUse/:id",
//   PatientRegistrationController.updateLifestyleAndSubstanceUse
// );
// // update dietary and activity assessment
// router.put(
//   "/updateDietaryActivityAssessment/:id",
//   PatientRegistrationController.updateDietaryActivityAssessment
// );

// // update clinical assessment
// router.put(
//   "/updateClinicalAssessment/:id",
//   upload.fields([
//     { name: "abiReport", maxCount: 10 },
//     { name: "tcpo2Report", maxCount: 10 },
//     { name: "monofilamentReport", maxCount: 10 },
//     { name: "vibrothermReport", maxCount: 10 },
//   ]),
//   PatientRegistrationController.updateClinicalAssessment
// );

// export const PatientRegistrationRoutes = router;

import express from "express";
import * as patientController from "./patientRegistration.controller";
import multer from "multer";
import { Configuration } from "../configurations/configuration.model";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Middleware: get all file fields from all sections
const dynamicMulterMiddleware = async (req: any, res: any, next: any) => {
  try {
    const allConfigs = await Configuration.find();
    if (!allConfigs || allConfigs.length === 0) throw new Error("No configuration found");

    const fileFields: string[] = [];
    allConfigs.forEach(section => {
      section.fields
        .filter(f => f.fieldType === "file")
        .forEach(f => fileFields.push(f.fieldName));
    });

    const multerFields = fileFields.map(name => ({ name, maxCount: 5 }));
    const dynamicUpload = multer({ dest: "uploads/" }).fields(multerFields);

    dynamicUpload(req, res, (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      next();
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Routes
// router.post("/create", dynamicMulterMiddleware, patientController.createPatient);
// router.get("/getAll", patientController.getAllPatients);
// router.get("/:id", patientController.getPatientById);
// router.put("/:id", dynamicMulterMiddleware, patientController.updatePatient);
// router.delete("/:id", patientController.deletePatient);
// router.post("/save-report",patientController.storeGeneratedReport);
// router.get("/reports",patientController.getAllReports);
// router.get("/get-report/:patientId", patientController.fetchReport);

// 1️⃣ Create patient
router.post("/create", dynamicMulterMiddleware, patientController.createPatient);

// 2️⃣ Save generated report
router.post("/save-report", patientController.storeGeneratedReport);

// 3️⃣ Get all reports
router.get("/reports", patientController.getAllReports);

// 4️⃣ Get single report by patient ID
router.get("/get-report/:patientId", patientController.fetchReport);

// 5️⃣ Get all patients
router.get("/getAll", patientController.getAllPatients);

// 6️⃣ Patient CRUD operations (must come after static routes)
router.get("/:id", patientController.getPatientById);
router.put("/:id", dynamicMulterMiddleware, patientController.updatePatient);
router.delete("/:id", patientController.deletePatient);


export const PatientRegistrationRoutes = router;



