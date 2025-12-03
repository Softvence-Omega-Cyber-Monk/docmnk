
// import { Request, Response } from "express";
// import { getPatientModel } from "./patientRegistration.model";
// import { uploadImgToCloudinary } from "../../utils/cloudinary";
// import { Configuration } from "../configurations/configuration.model";
// import {
//   getAllReportsService,
//   saveFullReport,
//   updatePatientRegistration as serviceUpdatePatient,
// } from "./patientRegistration.service";

// /**
//  * 🧩 Normalize non-file fields safely
//  */
// const normalizePatientData = (data: Record<string, any>, uploadedFiles: Record<string, string[]>) => {
//   const result: Record<string, any> = {};
//   for (const key in data) {
//     if (!key) continue;

//     // Use uploaded file if available
//     if (uploadedFiles[key]) {
//       result[key] = uploadedFiles[key];
//       continue;
//     }

//     // Convert single-item arrays to single value
//     if (Array.isArray(data[key])) result[key] = data[key][0];
//     else result[key] = data[key];

//     // Try JSON parse
//     if (typeof result[key] === "string") {
//       try {
//         result[key] = JSON.parse(result[key]);
//       } catch {
//         // keep string as-is
//       }
//     }
//   }
//   return result;
// };

// /**
//  * 🧠 Organize data by configuration sections
//  */
// const organizePatientData = (
//   data: Record<string, any>,
//   uploadedFiles: Record<string, string[]>,
//   configs: any[]
// ) => {
//   const organized: Record<string, any> = {};

//   configs.forEach((section) => {
//     organized[section.sectionName] = {};
//     section.fields.forEach((field: any) => {
//       const name = field.fieldName;
//       if (!name) return;

//       if (uploadedFiles[name]) {
//         organized[section.sectionName][name] = uploadedFiles[name];
//       } else if (data[name] !== undefined) {
//         organized[section.sectionName][name] = data[name];
//       }
//     });
//   });

//   // Extra general fields
//   if (data.campName) organized.campName = data.campName;

//   return organized;
// };

// /**
//  * 🧾 Create patient
//  */
// export const createPatient = async (req: Request, res: Response) => {
//   try {
//     const PatientModel = await getPatientModel();
//     const uploadedFiles: Record<string, string[]> = {};
//     const configs = await Configuration.find();

//     // Handle file uploads
//     if (req.files) {
//       const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//       for (const [fieldName, fileArray] of Object.entries(files)) {
//         for (const file of fileArray) {
//           const fileName = `${fieldName}-${Date.now()}-${Math.random()
//             .toString(36)
//             .substring(2, 9)}`;
//           const uploadResult = await uploadImgToCloudinary(
//             fileName,
//             file.path,
//             "patients/reports"
//           );
//           if (!uploadedFiles[fieldName]) uploadedFiles[fieldName] = [];
//           uploadedFiles[fieldName].push(uploadResult.secure_url);
//         }
//       }
//     }

//     const normalized = normalizePatientData(req.body, uploadedFiles);
//     const organized = organizePatientData(normalized, uploadedFiles, configs);

//     const patient = await PatientModel.create(organized);

//     res.status(201).json({
//       success: true,
//       message: "Patient registered successfully",
//       data: patient,
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: error.message || "Failed to create patient",
//     });
//   }
// };

// /**
//  * 📋 Get all patients
//  */
// export const getAllPatients = async (_req: Request, res: Response) => {
//   try {
//     const PatientModel = await getPatientModel();
//     const patients = await PatientModel.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: patients });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// /**
//  * 🔍 Get patient by ID
//  */
// export const getPatientById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const PatientModel = await getPatientModel();
//     const patient = await PatientModel.findById(id);

//     if (!patient) throw new Error("Patient not found");

//     res.status(200).json({ success: true, data: patient });
//   } catch (error: any) {
//     res.status(404).json({ success: false, message: error.message });
//   }
// };

// /**
//  * ✏️ Update patient (partial update, preserves existing fields)
//  */
// export const updatePatient = async (req: Request, res: Response) => {
//   try {
//     const patientId = req.params.id;
//     const uploadedFiles: Record<string, string[]> = {};
//     const configs = await Configuration.find();

//     // Handle file uploads
//     if (req.files) {
//       const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//       for (const [fieldName, fileArray] of Object.entries(files)) {
//         for (const file of fileArray) {
//           const fileName = `${fieldName}-${Date.now()}`;
//           const uploadResult = await uploadImgToCloudinary(
//             fileName,
//             file.path,
//             "patients/reports"
//           );
//           if (!uploadedFiles[fieldName]) uploadedFiles[fieldName] = [];
//           uploadedFiles[fieldName].push(uploadResult.secure_url);
//         }
//       }
//     }

//     const normalized = normalizePatientData(req.body, uploadedFiles);
//     const organized = organizePatientData(normalized, uploadedFiles, configs);

//     // Use service to merge with existing data
//     const updated = await serviceUpdatePatient(patientId, organized);

//     if (!updated) {
//       return res.status(404).json({ success: false, message: "Patient not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Patient updated successfully",
//       data: updated,
//     });
//   } catch (err: any) {
//     res.status(500).json({
//       success: false,
//       message: err.message || "Failed to update patient",
//     });
//   }
// };

// /**
//  * 🗑️ Delete patient
//  */
// export const deletePatient = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const PatientModel = await getPatientModel();
//     const deleted = await PatientModel.findByIdAndDelete(id);

//     if (!deleted) throw new Error("Patient not found");

//     res.status(200).json({
//       success: true,
//       message: "Patient deleted successfully",
//       data: deleted,
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: error.message || "Failed to delete patient",
//     });
//   }
// };

// /**
//  * 📝 Save generated report
//  */
// export const storeGeneratedReport = async (req: Request, res: Response) => {
//   try {
//     const reportData = req.body;
//     const patientId = reportData.patient_id;

//     if (!patientId) {
//       return res.status(400).json({ message: "patient_id is required" });
//     }

//     const saved = await saveFullReport(patientId, reportData);

//     res.status(200).json({
//       success: true,
//       message: "Report saved successfully",
//       data: saved,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to save report",
//       error: error.message,
//     });
//   }
// };

// /**
//  * 📤 Fetch all reports
//  */
// export const getAllReports = async (_req: Request, res: Response) => {
//   try {
//     const reports = await getAllReportsService();
//     res.status(200).json({
//       success: true,
//       message: "Reports fetched successfully",
//       data: reports,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch reports",
//       error: error.message,
//     });
//   }
// };

// /**
//  * 📄 Fetch single report with auto-detected patient name
//  */
// export const fetchReport = async (req: Request, res: Response) => {
//   try {
//     const { patientId } = req.params;
//     const Patient = await getPatientModel();
//     const patient = await Patient.findById(patientId);

//     if (!patient) {
//       return res.status(404).json({ success: false, message: "Patient not found" });
//     }

//     let fullName: string | null = null;
//     const nameKeys = ["Name", "name", "fullName", "FullName", "Full Name", "patient_name"];

//     for (const section of Object.keys(patient.toObject())) {
//       const sectionData = patient[section];
//       if (sectionData && typeof sectionData === "object") {
//         for (const key of Object.keys(sectionData)) {
//           if (nameKeys.includes(key)) {
//             fullName = sectionData[key];
//             break;
//           }
//         }
//       }
//       if (fullName) break;
//     }

//     res.status(200).json({
//       success: true,
//       fullName: fullName || null,
//       report: patient.report,
//       reportStatus: patient.reportStatus,
//       reportGeneratedAt: patient.reportGeneratedAt,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch report",
//       error: error.message,
//     });
//   }
// };


import { Request, Response } from "express";
import { getPatientModel } from "./patientRegistration.model";
import { uploadImgToCloudinary } from "../../utils/cloudinary";
import {
  getAllReportsService,
  saveFullReport,
  updatePatientRegistration as serviceUpdatePatient,
} from "./patientRegistration.service";

// Default sections
const DEFAULT_SECTIONS = [
  "Registration",
  "Medical History",
  "Substance Use",
  "Diet & Activity",
  "Clinical Assessment"
];

/**
 * Normalize and nest patient data dynamically
 */
const normalizePatientData = (
  data: Record<string, any>,
  uploadedFiles: Record<string, string[]>,
  allSections: string[] = DEFAULT_SECTIONS,
  existingData: Record<string, any> = {}
) => {
  const result: Record<string, any> = {};

  // Initialize all sections from existing data if available, otherwise empty
  allSections.forEach(section => {
    result[section] = existingData[section] ? { ...existingData[section] } : {};
  });

  const setNested = (obj: any, path: string[], value: any) => {
    let current = obj;
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      if (i === path.length - 1) {
        current[key] = value;
      } else {
        if (!current[key] || typeof current[key] !== "object") current[key] = {};
        current = current[key];
      }
    }
  };

  // Map text fields
  for (const key in data) {
    if (!key) continue;
    const value = Array.isArray(data[key]) && data[key].length === 1 ? data[key][0] : data[key];
    let path = key.split(/\[|\]/).filter(Boolean);
    if (path.length === 1) path = ["Registration", path[0]];

    const section = path[0];
    setNested(result[section], path.slice(1), value);
  }

  // Map uploaded files
  for (const key in uploadedFiles) {
    const path = key.split(/\[|\]/).filter(Boolean);
    const section = path[0] || "Registration";
    setNested(result[section], path.slice(1), uploadedFiles[key]);
  }

  return result;
};


/**
 * Organize patient data (already nested)
 */
const organizePatientData = (data: Record<string, any>) => data;

/**
 * Create patient
 */
export const createPatient = async (req: Request, res: Response) => {
  try {
    const PatientModel = await getPatientModel();
    const uploadedFiles: Record<string, string[]> = {};

    // Handle file uploads
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      for (const [fieldName, fileArray] of Object.entries(files)) {
        for (const file of fileArray) {
          const fileName = `${fieldName}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          const uploadResult = await uploadImgToCloudinary(fileName, file.path, "patients/reports");
          if (!uploadedFiles[fieldName]) uploadedFiles[fieldName] = [];
          uploadedFiles[fieldName].push(uploadResult.secure_url);
        }
      }
    }

    const normalized = normalizePatientData(req.body, uploadedFiles);
    const organized = organizePatientData(normalized);

    const patient = await PatientModel.create(organized);

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: patient,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create patient",
    });
  }
};

/**
 * Get all patients
 */
export const getAllPatients = async (_req: Request, res: Response) => {
  try {
    const PatientModel = await getPatientModel();
    const patients = await PatientModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: patients });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get patient by ID
 */
export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const PatientModel = await getPatientModel();
    const patient = await PatientModel.findById(id);

    if (!patient) throw new Error("Patient not found");

    res.status(200).json({ success: true, data: patient });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

/**
 * Update patient (partial update)
 */
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const patientId = req.params.id;
    const uploadedFiles: Record<string, string[]> = {};

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      for (const [fieldName, fileArray] of Object.entries(files)) {
        for (const file of fileArray) {
          const fileName = `${fieldName}-${Date.now()}`;
          const uploadResult = await uploadImgToCloudinary(fileName, file.path, "patients/reports");
          if (!uploadedFiles[fieldName]) uploadedFiles[fieldName] = [];
          uploadedFiles[fieldName].push(uploadResult.secure_url);
        }
      }
    }

    const normalized = normalizePatientData(req.body, uploadedFiles);
    const organized = organizePatientData(normalized);

    const updated = await serviceUpdatePatient(patientId, organized);

    if (!updated) return res.status(404).json({ success: false, message: "Patient not found" });

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Failed to update patient" });
  }
};

/**
 * Delete patient
 */
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const PatientModel = await getPatientModel();
    const deleted = await PatientModel.findByIdAndDelete(id);

    if (!deleted) throw new Error("Patient not found");

    res.status(200).json({ success: true, message: "Patient deleted successfully", data: deleted });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Failed to delete patient" });
  }
};

/**
 * Save generated report
 */
export const storeGeneratedReport = async (req: Request, res: Response) => {
  try {
    const reportData = req.body;
    const patientId = reportData.patient_id;

    if (!patientId) return res.status(400).json({ message: "patient_id is required" });

    const saved = await saveFullReport(patientId, reportData);

    res.status(200).json({ success: true, message: "Report saved successfully", data: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to save report", error: error.message });
  }
};

/**
 * Fetch all reports
 */
export const getAllReports = async (_req: Request, res: Response) => {
  try {
    const reports = await getAllReportsService();
    res.status(200).json({ success: true, message: "Reports fetched successfully", data: reports });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch reports", error: error.message });
  }
};

/**
 * Fetch single report with auto-detected patient name
 */
export const fetchReport = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const Patient = await getPatientModel();
    const patient = await Patient.findById(patientId);

    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

    let fullName: string | null = null;
    const nameKeys = ["Name", "name", "fullName", "FullName", "Full Name", "patient_name"];

    for (const section of Object.keys(patient.toObject())) {
      const sectionData = patient[section];
      if (sectionData && typeof sectionData === "object") {
        for (const key of Object.keys(sectionData)) {
          if (nameKeys.includes(key)) {
            fullName = sectionData[key];
            break;
          }
        }
      }
      if (fullName) break;
    }

    res.status(200).json({
      success: true,
      fullName: fullName || null,
      report: patient.report,
      reportStatus: patient.reportStatus,
      reportGeneratedAt: patient.reportGeneratedAt,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch report", error: error.message });
  }
};

