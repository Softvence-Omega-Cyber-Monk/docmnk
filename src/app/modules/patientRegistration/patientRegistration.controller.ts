import { Request, Response } from "express";
import { PatientRegistrationService } from "./patientRegistration.service";
import { IPatientRegistration } from "./patientRegistration.interface";
import {
  uploadImgToCloudinary,
  uploadMultipleImages,
} from "../../utils/cloudinary"; // adjust path if needed

// const registerPatient = async (req: Request, res: Response) => {
//   try {
//     console.log("🧾 Form-data:", req.body);
//     console.log("📎 Uploaded file:", req.file);

//     let previousReportUrl: string | undefined;

//     if (req.file) {
//       const file = req.file;
//       const imageName = `previousReport-${Date.now()}`;
//       const uploadResult = await uploadImgToCloudinary(
//         imageName,
//         file.path,
//         "patients/reports"
//       );
//       previousReportUrl = uploadResult.secure_url;
//     }

//     // Extract form fields
//     const {
//       fullName,
//       gender,
//       dateOfBirth,
//       age,
//       phoneNumber,
//       occupation,
//       address,
//       medicalHistory,
//     } = req.body as any;

//     // Parse JSON string from form-data
//     let parsedMedicalHistory: any = {};
//     if (medicalHistory) {
//       try {
//         parsedMedicalHistory = JSON.parse(medicalHistory);
//       } catch {
//         parsedMedicalHistory = {};
//       }
//     }

//     // Attach uploaded report URL
//     if (previousReportUrl) {
//       parsedMedicalHistory.previousReports = [previousReportUrl];
//     }

//     const data: IPatientRegistration = {
//       fullName,
//       gender,
//       dateOfBirth,
//       age: Number(age),
//       phoneNumber,
//       occupation,
//       address,
//       medicalHistory: parsedMedicalHistory,
//       lifestyleAndSubstanceUse: JSON.parse(
//         req.body.lifestyleAndSubstanceUse || "{}"
//       ),
//       dietaryActivityAssessment: JSON.parse(
//         req.body.dietaryActivityAssessment || "{}"
//       ),
//     };

//     const patient = await PatientRegistrationService.createPatientRegistration(
//       data
//     );

//     res.status(201).json({
//       success: true,
//       message: "🩺 Patient registered successfully",
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

const registerPatient = async (req: Request, res: Response) => {
  try {
    console.log("🧾 Form-data:", req.body);
    console.log("📎 Uploaded files:", req.files);

    const uploadedReports: any = {};

    // Handle multiple file uploads
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Process each file field
      for (const [fieldName, fileArray] of Object.entries(files)) {
        console.log(`Processing ${fileArray.length} files for ${fieldName}`);
        
        for (const file of fileArray) {
          const imageName = `${fieldName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const uploadResult = await uploadImgToCloudinary(
            imageName,
            file.path,
            "patients/reports"
          );
          
          if (!uploadedReports[fieldName]) {
            uploadedReports[fieldName] = [];
          }
          uploadedReports[fieldName].push(uploadResult.secure_url);
          console.log(`✅ Uploaded ${fieldName}: ${uploadResult.secure_url}`);
        }
      }
    }

    // Extract form fields
    const {
      fullName,
      gender,
      dateOfBirth,
      age,
      phoneNumber,
      occupation,
      address,
      medicalHistory,
      lifestyleAndSubstanceUse,
      dietaryActivityAssessment,
      clinicalAssessment
    } = req.body;

    // Parse JSON fields with error handling
    let parsedMedicalHistory: any = {};
    let parsedLifestyle: any = {};
    let parsedDietary: any = {};
    let parsedClinical: any = {};

    try {
      parsedMedicalHistory = medicalHistory ? JSON.parse(medicalHistory) : {};
    } catch (error) {
      console.error("❌ Error parsing medicalHistory:", error);
    }

    try {
      parsedLifestyle = lifestyleAndSubstanceUse ? JSON.parse(lifestyleAndSubstanceUse) : {};
    } catch (error) {
      console.error("❌ Error parsing lifestyleAndSubstanceUse:", error);
    }

    try {
      parsedDietary = dietaryActivityAssessment ? JSON.parse(dietaryActivityAssessment) : {};
    } catch (error) {
      console.error("❌ Error parsing dietaryActivityAssessment:", error);
    }

    try {
      parsedClinical = clinicalAssessment ? JSON.parse(clinicalAssessment) : {};
    } catch (error) {
      console.error("❌ Error parsing clinicalAssessment:", error);
    }

    // Attach uploaded files to appropriate sections
    if (Object.keys(uploadedReports).length > 0) {
      console.log("📁 Attaching uploaded reports to patient data");
      
      // Medical History Reports
      if (uploadedReports.previousReport) {
        parsedMedicalHistory.previousReports = uploadedReports.previousReport;
        console.log("📋 Added previous reports to medical history");
      }

      // Clinical Assessment Reports
      if (!parsedClinical.investigations) {
        parsedClinical.investigations = {};
      }
      if (!parsedClinical.investigations.reports) {
        parsedClinical.investigations.reports = {};
      }

      // Map uploaded reports to clinical assessment
      if (uploadedReports.abiReport) {
        parsedClinical.investigations.reports.abiReport = uploadedReports.abiReport;
        console.log("📊 Added ABI reports");
      }
      if (uploadedReports.tcpo2Report) {
        parsedClinical.investigations.reports.tcpo2Report = uploadedReports.tcpo2Report;
        console.log("📊 Added TcPO2 reports");
      }
      if (uploadedReports.monofilamentReport) {
        parsedClinical.investigations.reports.monofilamentReport = uploadedReports.monofilamentReport;
        console.log("📊 Added monofilament reports");
      }
      if (uploadedReports.vibrothermReport) {
        parsedClinical.investigations.reports.vibrothermReport = uploadedReports.vibrothermReport;
        console.log("📊 Added vibrotherm reports");
      }
    }

    // Create patient data object
    const data: IPatientRegistration = {
      fullName,
      gender,
      dateOfBirth,
      age: Number(age),
      phoneNumber,
      occupation,
      address,
      medicalHistory: parsedMedicalHistory,
      lifestyleAndSubstanceUse: parsedLifestyle,
      dietaryActivityAssessment: parsedDietary,
      clinicalAssessment: parsedClinical,
    };

    console.log("📦 Final patient data:", JSON.stringify(data, null, 2));

    // Save to database
    const patient = await PatientRegistrationService.createPatientRegistration(data);

    res.status(201).json({
      success: true,
      message: "🩺 Patient registered successfully with all reports",
      data: patient,
    });
  } catch (error: any) {
    console.error("❌ Error registering patient:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to register patient",
    });
  }
};
const getSinglePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const patient = await PatientRegistrationService.getSinglePatient(id);

    res.status(200).json({
      success: true,
      message: "✅ Patient fetched successfully",
      data: patient,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Patient not found",
    });
  }
};
export const PatientRegistrationController = {
  registerPatient,
  getSinglePatient,
};
