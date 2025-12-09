import express from "express";
import * as patientController from "./registration.controller";
import multer from "multer";
import { Configuration } from "../configurations/configuration.model";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * Middleware: dynamically generate multer fields from configuration
 */
const dynamicMulterMiddleware = async (req: any, res: any, next: any) => {
  try {
    const allConfigs = await Configuration.find();
    if (!allConfigs || allConfigs.length === 0)
      return res.status(500).json({ success: false, message: "No configuration found" });

    const fileFields: string[] = [];
    allConfigs.forEach((section) => {
      section.fields
        .filter((f) => f.fieldType === "file")
        .forEach((f) => fileFields.push(f.fieldName));
    });

    const multerFields = fileFields.map((name) => ({ name, maxCount: 5 }));
    const dynamicUpload = multer({ dest: "uploads/" }).fields(multerFields);

    dynamicUpload(req, res, (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      next(); // ✅ call next() correctly
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ───── PATIENT CRUD ─────
router.post("/create", dynamicMulterMiddleware, patientController.createPatient);
router.get("/getAll", patientController.getAllPatients);
router.get("/getSingleRegistration/:userId", patientController.getPatientById);

export const RegistrationRoutes = router;