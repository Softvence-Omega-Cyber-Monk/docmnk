import { Request, Response } from "express";
import { PatientRegistrationService } from "./patientRegistration.service";
import { IPatientRegistration } from "./patientRegistration.interface";
import {
  uploadImgToCloudinary,
  uploadMultipleImages,
} from "../../utils/cloudinary"; // adjust path if needed

const registerPatient = async (req: Request, res: Response) => {
  try {
    console.log("🧾 Form-data:", req.body);
    console.log("📎 Uploaded file:", req.file);

    let previousReportUrl: string | undefined;

    if (req.file) {
      const file = req.file;
      const imageName = `previousReport-${Date.now()}`;
      const uploadResult = await uploadImgToCloudinary(
        imageName,
        file.path,
        "patients/reports"
      );
      previousReportUrl = uploadResult.secure_url;
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
    } = req.body as any;

    // Parse JSON string from form-data
    let parsedMedicalHistory: any = {};
    if (medicalHistory) {
      try {
        parsedMedicalHistory = JSON.parse(medicalHistory);
      } catch {
        parsedMedicalHistory = {};
      }
    }

    // Attach uploaded report URL
    if (previousReportUrl) {
      parsedMedicalHistory.previousReports = [previousReportUrl];
    }

    const data: IPatientRegistration = {
      fullName,
      gender,
      dateOfBirth,
      age: Number(age),
      phoneNumber,
      occupation,
      address,
      medicalHistory: parsedMedicalHistory,
      lifestyleAndSubstanceUse: JSON.parse(req.body.lifestyleAndSubstanceUse || "{}"),
    };

    const patient = await PatientRegistrationService.createPatientRegistration(data);

    res.status(201).json({
      success: true,
      message: "🩺 Patient registered successfully",
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

export const PatientRegistrationController = {
  registerPatient,
};
