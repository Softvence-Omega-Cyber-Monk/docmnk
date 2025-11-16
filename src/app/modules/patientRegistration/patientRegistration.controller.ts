// import { Request, Response } from "express";
// import { PatientRegistrationService } from "./patientRegistration.service";
// import { IClinicalAssessment, IDietaryActivityAssessment, IPatientRegistration } from "./patientRegistration.interface";
// import {
//   uploadImgToCloudinary,
//   uploadMultipleImages,
// } from "../../utils/cloudinary"; // adjust path if needed


// const registerPatient = async (req: Request, res: Response) => {
//   try {
//     console.log("🧾 Form-data:", req.body);
//     console.log("📎 Uploaded files:", req.files);

//     const uploadedReports: any = {};

//     // Handle multiple file uploads
//     if (req.files) {
//       const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
//       // Process each file field
//       for (const [fieldName, fileArray] of Object.entries(files)) {
//         console.log(`Processing ${fileArray.length} files for ${fieldName}`);
        
//         for (const file of fileArray) {
//           const imageName = `${fieldName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//           const uploadResult = await uploadImgToCloudinary(
//             imageName,
//             file.path,
//             "patients/reports"
//           );
          
//           if (!uploadedReports[fieldName]) {
//             uploadedReports[fieldName] = [];
//           }
//           uploadedReports[fieldName].push(uploadResult.secure_url);
//           console.log(`✅ Uploaded ${fieldName}: ${uploadResult.secure_url}`);
//         }
//       }
//     }

//     // Extract form fields
//     const {
//       fullName,
//       gender,
//       dateOfBirth,
//       age,
//       phoneNumber,
//       email,
//       occupation,
//       address,
//       medicalHistory,
//       lifestyleAndSubstanceUse,
//       dietaryActivityAssessment,
//       clinicalAssessment
//     } = req.body;

//     // Parse JSON fields with error handling
//     let parsedMedicalHistory: any = {};
//     let parsedLifestyle: any = {};
//     let parsedDietary: any = {};
//     let parsedClinical: any = {};

//     try {
//       parsedMedicalHistory = medicalHistory ? JSON.parse(medicalHistory) : {};
//     } catch (error) {
//       console.error("❌ Error parsing medicalHistory:", error);
//     }

//     try {
//       parsedLifestyle = lifestyleAndSubstanceUse ? JSON.parse(lifestyleAndSubstanceUse) : {};
//     } catch (error) {
//       console.error("❌ Error parsing lifestyleAndSubstanceUse:", error);
//     }

//     try {
//       parsedDietary = dietaryActivityAssessment ? JSON.parse(dietaryActivityAssessment) : {};
//     } catch (error) {
//       console.error("❌ Error parsing dietaryActivityAssessment:", error);
//     }

//     try {
//       parsedClinical = clinicalAssessment ? JSON.parse(clinicalAssessment) : {};
//     } catch (error) {
//       console.error("❌ Error parsing clinicalAssessment:", error);
//     }

//     // Attach uploaded files to appropriate sections
//     if (Object.keys(uploadedReports).length > 0) {
//       console.log("📁 Attaching uploaded reports to patient data");
      
//       // Medical History Reports
//       if (uploadedReports.previousReport) {
//         parsedMedicalHistory.previousReports = uploadedReports.previousReport;
//         console.log("📋 Added previous reports to medical history");
//       }

//       // Clinical Assessment Reports
//       if (!parsedClinical.investigations) {
//         parsedClinical.investigations = {};
//       }
//       if (!parsedClinical.investigations.reports) {
//         parsedClinical.investigations.reports = {};
//       }

//       // Map uploaded reports to clinical assessment
//       if (uploadedReports.abiReport) {
//         parsedClinical.investigations.reports.abiReport = uploadedReports.abiReport;
//         console.log("📊 Added ABI reports");
//       }
//       if (uploadedReports.tcpo2Report) {
//         parsedClinical.investigations.reports.tcpo2Report = uploadedReports.tcpo2Report;
//         console.log("📊 Added TcPO2 reports");
//       }
//       if (uploadedReports.monofilamentReport) {
//         parsedClinical.investigations.reports.monofilamentReport = uploadedReports.monofilamentReport;
//         console.log("📊 Added monofilament reports");
//       }
//       if (uploadedReports.vibrothermReport) {
//         parsedClinical.investigations.reports.vibrothermReport = uploadedReports.vibrothermReport;
//         console.log("📊 Added vibrotherm reports");
//       }
//     }

//     // Create patient data object
//     const data: IPatientRegistration = {
//       fullName,
//       gender,
//       dateOfBirth,
//       age: Number(age),
//       phoneNumber,
//       email,
//       occupation,
//       address,
//       medicalHistory: parsedMedicalHistory,
//       lifestyleAndSubstanceUse: parsedLifestyle,
//       dietaryActivityAssessment: parsedDietary,
//       clinicalAssessment: parsedClinical,
//     };

//     console.log("📦 Final patient data:", JSON.stringify(data, null, 2));

//     // Save to database
//     const patient = await PatientRegistrationService.createPatientRegistration(data);

//     res.status(201).json({
//       success: true,
//       message: "🩺 Patient registered successfully with all reports",
//       data: patient,
//     });
//   } catch (error: any) {
//     console.error("❌ Error registering patient:", error);
//     res.status(400).json({
//       success: false,
//       message: error.message || "Failed to register patient",
//     });
//   }
// };





// const getSinglePatient = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const patient = await PatientRegistrationService.getSinglePatient(id);

//     res.status(200).json({
//       success: true,
//       message: "✅ Patient fetched successfully",
//       data: patient,
//     });
//   } catch (error: any) {
//     res.status(404).json({
//       success: false,
//       message: error.message || "Patient not found",
//     });
//   }
// };

// // ✅ Get all
// const getAllPatients = async (req: Request, res: Response) => {
//   try {
//     const result = await PatientRegistrationService.getAllPatients();
//     res.status(200).json({
//       success: true,
//       message: "All patients retrieved successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// // Update medical history
// const updateMedicalHistory = async (req: Request, res: Response) => {
//   try {
//     console.log("🧾 Incoming update request for Medical History");
//     console.log("🧍‍♂️ Patient ID:", req.params.id);
//     console.log("📎 Uploaded files:", req.files);

//     const { id } = req.params;

//     const uploadedReports: any = {};

//     // ✅ Handle uploaded files (if any)
//     if (req.files) {
//       const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//       for (const [fieldName, fileArray] of Object.entries(files)) {
//         console.log(`Processing ${fileArray.length} file(s) for ${fieldName}`);

//         for (const file of fileArray) {
//           const imageName = `${fieldName}-${Date.now()}-${Math.random()
//             .toString(36)
//             .substr(2, 9)}`;

//           const uploadResult = await uploadImgToCloudinary(
//             imageName,
//             file.path,
//             "patients/reports"
//           );

//           if (!uploadedReports[fieldName]) {
//             uploadedReports[fieldName] = [];
//           }

//           uploadedReports[fieldName].push(uploadResult.secure_url);
//           console.log(`✅ Uploaded ${fieldName}: ${uploadResult.secure_url}`);
//         }
//       }
//     }

//     // ✅ Parse JSON field
//     let parsedMedicalHistory: any = {};
//     try {
//       parsedMedicalHistory = req.body.medicalHistory
//         ? JSON.parse(req.body.medicalHistory)
//         : {};
//     } catch (error) {
//       console.error("❌ Error parsing medicalHistory JSON:", error);
//       return res.status(400).json({
//         success: false,
//         message: "Invalid JSON format in medicalHistory field",
//       });
//     }

//     // ✅ Attach uploaded files to medicalHistory if any
//     if (Object.keys(uploadedReports).length > 0) {
//       console.log("📁 Attaching uploaded medical reports");

//       if (uploadedReports.previousReport) {
//         parsedMedicalHistory.previousReports = uploadedReports.previousReport;
//         console.log("📋 Added previous medical reports");
//       }
//     }

//     // ✅ Call service to update
//     const updatedPatient =
//       await PatientRegistrationService.updateMedicalHistory(id, parsedMedicalHistory);

//     if (!updatedPatient) {
//       return res.status(404).json({
//         success: false,
//         message: "Patient not found",
//       });
//     }

//     console.log("✅ Medical history updated successfully for patient:", id);

//     res.status(200).json({
//       success: true,
//       message: "🧠 Medical history updated successfully",
//       data: updatedPatient,
//     });
//   } catch (error: any) {
//     console.error("❌ Error updating medical history:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update medical history",
//     });
//   }
// };

// const updateLifestyleAndSubstanceUse = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     let parsedLifestyle: any = {};

//     // Parse JSON safely if stringified
//     try {
//       parsedLifestyle =
//         typeof req.body.lifestyleAndSubstanceUse === "string"
//           ? JSON.parse(req.body.lifestyleAndSubstanceUse)
//           : req.body.lifestyleAndSubstanceUse;
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid JSON format in lifestyleAndSubstanceUse field",
//       });
//     }

//     const updatedPatient =
//       await PatientRegistrationService.updateLifestyleAndSubstanceUse(
//         id,
//         parsedLifestyle
//       );

//     res.status(200).json({
//       success: true,
//       message: "Lifestyle and substance use updated successfully",
//       data: updatedPatient,
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: error.message || "Failed to update lifestyle and substance use",
//     });
//   }
// };

// // Update dietary and activity assessment
// const updateDietaryActivityAssessment = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     // Make sure the field exists
//     if (!req.body || !req.body.dietaryActivityAssessment) {
//       return res.status(400).json({
//         success: false,
//         message: "dietaryActivityAssessment field is required in request body",
//       });
//     }

//     // Parse JSON safely if string
//     let dietaryData: IDietaryActivityAssessment;
//     if (typeof req.body.dietaryActivityAssessment === "string") {
//       try {
//         dietaryData = JSON.parse(req.body.dietaryActivityAssessment);
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid JSON format in dietaryActivityAssessment field",
//         });
//       }
//     } else {
//       dietaryData = req.body.dietaryActivityAssessment;
//     }

//     // Optional: Basic validation for required nested fields
//     if (!dietaryData.currentDietary || !dietaryData.physicalActivity) {
//       return res.status(400).json({
//         success: false,
//         message: "currentDietary and physicalActivity are required inside dietaryActivityAssessment",
//       });
//     }

//     const updatedPatient =
//       await PatientRegistrationService.updateDietaryActivityAssessmentService(
//         id,
//         dietaryData
//       );

//     if (!updatedPatient) {
//       return res.status(404).json({
//         success: false,
//         message: "Patient not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Dietary and activity assessment updated successfully",
//       data: updatedPatient,
//     });
//   } catch (error: any) {
//     console.error("❌ Error updating dietaryActivityAssessment:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update dietary and activity assessment",
//     });
//   }
// };

// const allowedReportKeys = [
//   "abiReport",
//   "tcpo2Report",
//   "monofilamentReport",
//   "vibrothermReport",
// ] as const;
// type ReportKey = (typeof allowedReportKeys)[number];

// const updateClinicalAssessment = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     if (!req.body.clinicalAssessment) {
//       return res.status(400).json({
//         success: false,
//         message: "clinicalAssessment field is required in request body",
//       });
//     }

//     // Parse clinicalAssessment JSON safely
//     let clinicalData: IClinicalAssessment = {};
//     try {
//       clinicalData =
//         typeof req.body.clinicalAssessment === "string"
//           ? JSON.parse(req.body.clinicalAssessment)
//           : req.body.clinicalAssessment;
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid JSON format in clinicalAssessment field",
//       });
//     }

//     // Ensure investigations and reports exist
//     if (!clinicalData.investigations) clinicalData.investigations = {};
//     if (!clinicalData.investigations.reports) clinicalData.investigations.reports = {};

//     // Handle uploaded files
//     if (req.files) {
//       const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//       for (const [fieldName, fileArray] of Object.entries(files)) {
//         if (!allowedReportKeys.includes(fieldName as ReportKey)) continue;

//         const uploadedUrls: string[] = [];
//         for (const file of fileArray) {
//           const uploadResult = await uploadImgToCloudinary(
//             `${fieldName}-${Date.now()}`,
//             file.path,
//             "patients/clinicalReports"
//           );
//           uploadedUrls.push(uploadResult.secure_url);
//         }

//         clinicalData.investigations.reports[fieldName as ReportKey] = uploadedUrls;
//       }
//     }

//     // Update patient clinical assessment
//     const updatedPatient: IPatientRegistration | null =
//       await PatientRegistrationService.updateClinicalAssessmentService(id, clinicalData);

//     if (!updatedPatient) {
//       return res.status(404).json({
//         success: false,
//         message: "Patient not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Clinical assessment updated successfully",
//       data: updatedPatient,
//     });
//   } catch (error: any) {
//     console.error("❌ Error updating clinical assessment:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update clinical assessment",
//     });
//   }
// };
// export const PatientRegistrationController = {
//   registerPatient,
//   getSinglePatient,
//   getAllPatients,
//   updateMedicalHistory,
//   updateLifestyleAndSubstanceUse,
//   updateDietaryActivityAssessment,
//   updateClinicalAssessment,
// };



// import { Request, Response } from "express";
// import { getPatientModel } from "./patientRegistration.model";
// import { uploadImgToCloudinary } from "../../utils/cloudinary";
// import { Configuration } from "../configurations/configuration.model";

// // Utility to normalize fields (arrays → single value for non-file fields)
// const normalizePatientData = (data: Record<string, any>, uploadedFiles: Record<string, string[]>) => {
//   for (const key in data) {
//     if (Array.isArray(data[key]) && !uploadedFiles[key]) {
//       // Take first element if not a file field
//       data[key] = data[key][0];
//     }

//     // Parse JSON strings if any
//     if (typeof data[key] === "string") {
//       try { data[key] = JSON.parse(data[key]); } catch {}
//     }
//   }
//   return data;
// };

// // Create patient dynamically
// export const createPatient = async (req: Request, res: Response) => {
//   try {
//     const PatientModel = await getPatientModel();
//     const uploadedFiles: Record<string, string[]> = {};

//     // Handle uploaded files
//     if (req.files) {
//       const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//       for (const [fieldName, fileArray] of Object.entries(files)) {
//         for (const file of fileArray) {
//           const fileName = `${fieldName}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
//           const uploadResult = await uploadImgToCloudinary(fileName, file.path, "patients/reports");
//           if (!uploadedFiles[fieldName]) uploadedFiles[fieldName] = [];
//           uploadedFiles[fieldName].push(uploadResult.secure_url);
//         }
//       }
//     }

//     // Merge form data and uploaded files
//     let patientData: Record<string, any> = { ...req.body, ...uploadedFiles };

//     // Normalize arrays for non-file fields
//     patientData = normalizePatientData(patientData, uploadedFiles);

//     // Save patient
//     const patient = await PatientModel.create(patientData);

//     res.status(201).json({
//       success: true,
//       message: "Patient registered successfully",
//       data: patient,
//     });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message || "Failed to create patient" });
//   }
// };

// // Get all patients
// export const getAllPatients = async (_req: Request, res: Response) => {
//   try {
//     const PatientModel = await getPatientModel();
//     const patients = await PatientModel.find();
//     res.status(200).json({ success: true, data: patients });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// // Get patient by ID
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

// // Update patient dynamically
// export const updatePatient = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const PatientModel = await getPatientModel();
//     const uploadedFiles: Record<string, string[]> = {};

//     // Handle uploaded files
//     if (req.files) {
//       const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//       for (const [fieldName, fileArray] of Object.entries(files)) {
//         for (const file of fileArray) {
//           const fileName = `${fieldName}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
//           const uploadResult = await uploadImgToCloudinary(fileName, file.path, "patients/reports");
//           if (!uploadedFiles[fieldName]) uploadedFiles[fieldName] = [];
//           uploadedFiles[fieldName].push(uploadResult.secure_url);
//         }
//       }
//     }

//     // Merge form data and uploaded files
//     let patientData: Record<string, any> = { ...req.body, ...uploadedFiles };

//     // Normalize arrays for non-file fields
//     patientData = normalizePatientData(patientData, uploadedFiles);

//     // Update patient
//     const patient = await PatientModel.findByIdAndUpdate(id, patientData, { new: true });
//     if (!patient) throw new Error("Patient not found");

//     res.status(200).json({ success: true, data: patient });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// // Delete patient
// export const deletePatient = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const PatientModel = await getPatientModel();
//     const patient = await PatientModel.findByIdAndDelete(id);
//     if (!patient) throw new Error("Patient not found");
//     res.status(200).json({ success: true, message: "Patient deleted successfully", data: patient });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };



import { Request, Response } from "express";
import { getPatientModel } from "./patientRegistration.model";
import { uploadImgToCloudinary } from "../../utils/cloudinary";
import { Configuration } from "../configurations/configuration.model";
import { getAllReportsService, getReportByPatientId, saveFullReport } from "./patientRegistration.service";

/**
 * 🧩 Utility — normalize non-file field data
 * - Converts single-item arrays into values
 * - Parses JSON strings safely
 */
const normalizePatientData = (
  data: Record<string, any>,
  uploadedFiles: Record<string, string[]>
) => {
  for (const key in data) {
    if (Array.isArray(data[key]) && !uploadedFiles[key]) {
      data[key] = data[key][0]; // keep only the first element if not a file field
    }

    if (typeof data[key] === "string") {
      try {
        data[key] = JSON.parse(data[key]);
      } catch {
        // ignore JSON parse errors
      }
    }
  }
  return data;
};

/**
 * 🧠 Utility — group data by configuration section
 */
const organizePatientData = (
  data: Record<string, any>,
  uploadedFiles: Record<string, string[]>,
  configs: any[]
) => {
  const organized: Record<string, any> = {};

  configs.forEach((section) => {
    organized[section.sectionName] = {};
    section.fields.forEach((field: any) => {
      const name = field.fieldName;
      if (uploadedFiles[name]) {
        organized[section.sectionName][name] = uploadedFiles[name];
      } else if (data[name] !== undefined) {
        organized[section.sectionName][name] = data[name];
      }
    });
  });

  // Add general fields not part of configurations
  if (data.campName) organized.campName = data.campName;

  return organized;
};

/**
 * 🧾 Create patient
 */
export const createPatient = async (req: Request, res: Response) => {
  try {
    const PatientModel = await getPatientModel();
    const uploadedFiles: Record<string, string[]> = {};
    const configs = await Configuration.find();

    // 🖼️ Handle uploaded files
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      for (const [fieldName, fileArray] of Object.entries(files)) {
        for (const file of fileArray) {
          const fileName = `${fieldName}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`;
          const uploadResult = await uploadImgToCloudinary(
            fileName,
            file.path,
            "patients/reports"
          );
          if (!uploadedFiles[fieldName]) uploadedFiles[fieldName] = [];
          uploadedFiles[fieldName].push(uploadResult.secure_url);
        }
      }
    }

    // 🧩 Normalize and group data
    let patientData = normalizePatientData(req.body, uploadedFiles);
    const organizedData = organizePatientData(patientData, uploadedFiles, configs);

    // 💾 Save
    const patient = await PatientModel.create(organizedData);

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
 * 📋 Get all patients
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
 * 🔍 Get patient by ID
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
 * ✏️ Update patient
 */
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const PatientModel = await getPatientModel();
    const uploadedFiles: Record<string, string[]> = {};
    const configs = await Configuration.find();

    // 🖼️ Handle uploaded files
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      for (const [fieldName, fileArray] of Object.entries(files)) {
        for (const file of fileArray) {
          const fileName = `${fieldName}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`;
          const uploadResult = await uploadImgToCloudinary(
            fileName,
            file.path,
            "patients/reports"
          );
          if (!uploadedFiles[fieldName]) uploadedFiles[fieldName] = [];
          uploadedFiles[fieldName].push(uploadResult.secure_url);
        }
      }
    }

    // 🧩 Normalize and group updated data
    let patientData = normalizePatientData(req.body, uploadedFiles);
    const organizedData = organizePatientData(patientData, uploadedFiles, configs);

    // 💾 Update
    const patient = await PatientModel.findByIdAndUpdate(id, organizedData, { new: true });
    if (!patient) throw new Error("Patient not found");

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update patient",
    });
  }
};

/**
 * 🗑️ Delete patient
 */
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const PatientModel = await getPatientModel();
    const patient = await PatientModel.findByIdAndDelete(id);
    if (!patient) throw new Error("Patient not found");

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
      data: patient,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete patient",
    });
  }
};

export const storeGeneratedReport = async (req: Request, res: Response) => {
  try {
    const reportData = req.body;    // your full JSON object
    const patientId = reportData.patient_id;

    if (!patientId) {
      return res.status(400).json({ message: "patient_id is required" });
    }

    const saved = await saveFullReport(patientId, reportData);

    return res.status(200).json({
      success: true,
      message: "Report saved successfully",
      data: saved
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to save report",
      error: error.message
    });
  }
};

export const getAllReports = async (req: Request, res: Response) => {
  try {
    const reports = await getAllReportsService();

    res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      data: reports
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message
    });
  }
};

export const fetchReport = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;

    const Patient = await getPatientModel();
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // ---------------------------------------
    // ⭐ Automatically find name in ANY section
    // ---------------------------------------
    let fullName: string | null = null;

    const nameKeys = ["name", "fullName", "FullName", "Full Name", "patient_name"];

    for (const section of Object.keys(patient.toObject())) {
      const sectionData = patient[section];

      if (typeof sectionData === "object" && sectionData !== null) {
        for (const key of Object.keys(sectionData)) {
          if (nameKeys.includes(key)) {
            fullName = sectionData[key];
            break;
          }
        }
      }

      if (fullName) break;
    }

    return res.status(200).json({
      success: true,
      fullName: fullName || null,   // ⭐ return name
      report: patient.report,
      reportStatus: patient.reportStatus,
      reportGeneratedAt: patient.reportGeneratedAt
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch report",
      error: error.message
    });
  }
};

