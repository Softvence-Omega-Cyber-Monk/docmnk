// import { Request, Response } from "express";
// import { getPatientModel } from "./registration.model";
// import { uploadImgToCloudinary } from "../../utils/cloudinary";
// import { Configuration } from "../configurations/configuration.model";

// /**
//  * Normalize input (convert JSON, arrays, etc.)
//  */
// const normalizePatientData = (body: Record<string, any>, uploadedFiles: Record<string, string[]>) => {
//   const cleaned: Record<string, any> = {};

//   for (const key in body) {
//     if (!key) continue;

//     if (uploadedFiles[key]) {
//       cleaned[key] = uploadedFiles[key];
//       continue;
//     }

//     let val = Array.isArray(body[key]) ? body[key][0] : body[key];

//     if (typeof val === "string") {
//       try {
//         val = JSON.parse(val);
//       } catch {}
//     }

//     cleaned[key] = val;
//   }

//   return cleaned;
// };

// /**
//  * Organize normalized data into configuration sections
//  */
// const organizeBySection = (
//   normalized: Record<string, any>,
//   uploadedFiles: Record<string, string[]>,
//   configs: any[]
// ) => {
//   const output: Record<string, any> = {};

//   configs.forEach((section) => {
//     output[section.sectionName] = {};
//     section.fields.forEach((field: any) => {
//       const key = field.fieldName;
//       if (uploadedFiles[key]) output[section.sectionName][key] = uploadedFiles[key];
//       else if (normalized[key] !== undefined) output[section.sectionName][key] = normalized[key];
//     });
//   });

//   // Global fields
//   ["campId", "campName", "status", "userId", "reportApproved"].forEach((f) => {
//     if (normalized[f]) output[f] = normalized[f];
//   });

//   return output;
// };

// /**
//  * Create Patient
//  */
// export const createPatient = async (req: Request, res: Response) => {
//   try {
//     const PatientModel = await getPatientModel();
//     const configs = await Configuration.find();
//     const uploadedFiles: Record<string, string[]> = {};

//     if (req.files) {
//       const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//       for (const [fieldName, fileArray] of Object.entries(files)) {
//         uploadedFiles[fieldName] = [];
//         for (const file of fileArray) {
//           const fileName = `${fieldName}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
//           const uploaded = await uploadImgToCloudinary(fileName, file.path, "patients/reports");
//           uploadedFiles[fieldName].push(uploaded.secure_url);
//         }
//       }
//     }

//     const normalized = normalizePatientData(req.body, uploadedFiles);
//     const organized = organizeBySection(normalized, uploadedFiles, configs);

//     const saved = await PatientModel.create(organized);

//     res.status(201).json({ success: true, message: "Patient registered successfully", data: saved });
//   } catch (err: any) {
//     res.status(400).json({ success: false, message: err.message || "Failed to create patient" });
//   }
// };




import { Request, Response } from "express";
import { getPatientModel } from "./registration.model";
import { uploadImgToCloudinary } from "../../utils/cloudinary";
import { Configuration } from "../configurations/configuration.model";
import mongoose from "mongoose";
import { Account_Model } from "../auth/auth.schema";

/**
 * Normalize input (convert JSON, arrays, etc.)
 */
const normalizePatientData = (body: Record<string, any>, uploadedFiles: Record<string, string[]>) => {
  const cleaned: Record<string, any> = {};

  for (const key in body) {
    if (!key) continue;

    if (uploadedFiles[key]) {
      cleaned[key] = uploadedFiles[key];
      continue;
    }

    let val = Array.isArray(body[key]) ? body[key][0] : body[key];

    if (typeof val === "string") {
      try {
        val = JSON.parse(val);
      } catch {}
    }

    cleaned[key] = val;
  }

  return cleaned;
};

/**
 * Organize normalized data into configuration sections
 */
const organizeBySection = (
  normalized: Record<string, any>,
  uploadedFiles: Record<string, string[]>,
  configs: any[]
) => {
  const output: Record<string, any> = {};

  configs.forEach((section) => {
    output[section.sectionName] = {};
    section.fields.forEach((field: any) => {
      const key = field.fieldName;
      if (uploadedFiles[key]) output[section.sectionName][key] = uploadedFiles[key];
      else if (normalized[key] !== undefined) output[section.sectionName][key] = normalized[key];
    });
  });

  // Global fields
  ["campId", "campName", "status", "userId", "reportApproved"].forEach((f) => {
    if (normalized[f]) output[f] = normalized[f];
  });

  return output;
};

/**
 * Create Patient + Update Auth
 */
export const createPatient = async (req: Request, res: Response) => {
  try {
    const PatientModel = await getPatientModel();
    const configs = await Configuration.find();
    const uploadedFiles: Record<string, string[]> = {};

    // Upload files if any
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      for (const [fieldName, fileArray] of Object.entries(files)) {
        uploadedFiles[fieldName] = [];
        for (const file of fileArray) {
          const fileName = `${fieldName}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
          const uploaded = await uploadImgToCloudinary(fileName, file.path, "patients/reports");
          uploadedFiles[fieldName].push(uploaded.secure_url);
        }
      }
    }

    // Normalize & organize payload
    const normalized = normalizePatientData(req.body, uploadedFiles);
    const organized = organizeBySection(normalized, uploadedFiles, configs);

    // Save patient registration
    const savedPatient = await PatientModel.create(organized);

    // 🔹 Update Auth model if userId is provided
    let updatedAccount = null;
    if (normalized.userId) {
      updatedAccount = await Account_Model.findByIdAndUpdate(
        new mongoose.Types.ObjectId(normalized.userId.trim()),
        { alreadyFilledRegistrationForm: true },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: {
        patient: savedPatient,
        account: updatedAccount,
      },
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || "Failed to create patient" });
  }
};

/**
 * Get All Patients
 */
export const getAllPatients = async (_req: Request, res: Response) => {
  try {
    const PatientModel = await getPatientModel();
    const patients = await PatientModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: patients });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Get Patient by ID
 */
export const getPatientById = async (req: Request, res: Response) => {
  try {
    const PatientModel = await getPatientModel();
    // const patient = await PatientModel.findById(req.params.userId);
    const patient = await PatientModel.findOne({ userId: req.params.userId });
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, data: patient });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};