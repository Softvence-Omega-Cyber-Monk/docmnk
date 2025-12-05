
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
import { Configuration } from "../configurations/configuration.model";
import {
  getAllReportsService,
  saveFullReport,
  updatePatientRegistration as serviceUpdatePatient,
} from "./patientRegistration.service";

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
  ["campId", "campName", "status", "userId"].forEach((f) => {
    if (normalized[f]) output[f] = normalized[f];
  });

  return output;
};

/**
 * Create Patient
 */
export const createPatient = async (req: Request, res: Response) => {
  try {
    const PatientModel = await getPatientModel();
    const configs = await Configuration.find();
    const uploadedFiles: Record<string, string[]> = {};

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

    const normalized = normalizePatientData(req.body, uploadedFiles);
    const organized = organizeBySection(normalized, uploadedFiles, configs);

    const saved = await PatientModel.create(organized);

    res.status(201).json({ success: true, message: "Patient registered successfully", data: saved });
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
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, data: patient });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Update Patient
 */
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const patientId = req.params.id;
    const configs = await Configuration.find();
    const uploadedFiles: Record<string, string[]> = {};

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      for (const [fieldName, fileArray] of Object.entries(files)) {
        uploadedFiles[fieldName] = [];
        for (const file of fileArray) {
          const fileName = `${fieldName}-${Date.now()}`;
          const uploaded = await uploadImgToCloudinary(fileName, file.path, "patients/reports");
          uploadedFiles[fieldName].push(uploaded.secure_url);
        }
      }
    }

    const normalized = normalizePatientData(req.body, uploadedFiles);
    const organized = organizeBySection(normalized, uploadedFiles, configs);

    const updated = await serviceUpdatePatient(patientId, organized);
    if (!updated) return res.status(404).json({ success: false, message: "Patient not found" });

    res.status(200).json({ success: true, message: "Patient updated successfully", data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Delete Patient
 */
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const PatientModel = await getPatientModel();
    const deleted = await PatientModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, message: "Patient deleted successfully", data: deleted });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};


/* ---------------------------------------------------------
   📝 SAVE GENERATED REPORT
-----------------------------------------------------------*/
export const storeGeneratedReport = async (req: Request, res: Response) => {
  try {
    const patientId = req.body.patient_id;

    if (!patientId)
      return res.status(400).json({ success: false, message: "patient_id required" });

    const saved = await saveFullReport(patientId, req.body);

    res.status(200).json({
      success: true,
      message: "Report saved successfully",
      data: saved,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ---------------------------------------------------------
   📤 GET ALL REPORTS
-----------------------------------------------------------*/
export const getAllReports = async (_req: Request, res: Response) => {
  try {
    const data = await getAllReportsService();

    res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      data,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ---------------------------------------------------------
   📄 FETCH SINGLE REPORT
-----------------------------------------------------------*/
export const fetchReport = async (req: Request, res: Response) => {
  try {
    const Patient = await getPatientModel();
    const patient = await Patient.findById(req.params.patientId);

    if (!patient)
      return res.status(404).json({ success: false, message: "Patient not found" });

    let fullName: string | null = null;

    const possibleNames = ["name", "Name", "fullName", "Full Name", "patient_name"];

    for (const section of Object.keys(patient.toObject())) {
      const sec = patient[section];
      if (!sec || typeof sec !== "object") continue;

      for (const key of Object.keys(sec)) {
        if (possibleNames.includes(key)) {
          fullName = sec[key];
          break;
        }
      }

      if (fullName) break;
    }

    res.status(200).json({
      success: true,
      fullName,
      report: patient.report,
      reportStatus: patient.reportStatus,
      reportGeneratedAt: patient.reportGeneratedAt,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
