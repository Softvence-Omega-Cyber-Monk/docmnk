// import { ReportModel } from "./report.model";
// import { uploadImgToCloudinary, uploadMultipleImages } from "../../utils/cloudinary";
// import { IReport } from "./report.interface";

// const uploadReport = async (patientId: string, files: Express.Multer.File[]): Promise<IReport> => {
//   try {
//     console.log('=== UPLOAD REPORT START ===');
//     console.log('Patient ID:', patientId);
//     console.log('Files received:', files?.map(f => ({
//       originalname: f.originalname,
//       mimetype: f.mimetype,
//       path: f.path,
//       size: f.size,
//       filename: f.filename
//     })));

//     if (!patientId?.trim()) {
//       throw new Error("Valid patient ID is required");
//     }

//     if (!files || files.length === 0) {
//       throw new Error("No files provided");
//     }

//     const filePaths = files.map((file) => {
//       console.log('Processing file path:', file.path);
//       if (!file.path) {
//         throw new Error("Invalid file path");
//       }
//       return file.path;
//     });

//     console.log('File paths to upload:', filePaths);

//     // Check if files exist on disk
//     const fs = require('fs');
//     filePaths.forEach(path => {
//       const exists = fs.existsSync(path);
//       console.log(`File exists at ${path}:`, exists);
//     });

//     console.log('Calling uploadMultipleImages...');
//     const uploadedUrls = await uploadMultipleImages(filePaths, "patients/reports");
//     console.log('Uploaded URLs from Cloudinary:', uploadedUrls);
    
//     if (!uploadedUrls?.length) {
//       throw new Error("Failed to upload files - no URLs returned");
//     }

//     console.log('Creating report in database...');
//     const newReport = await ReportModel.create({
//       patientId: patientId.trim(),
//       reports: uploadedUrls  // Make sure this field name matches your schema
//     });

//     console.log('=== UPLOAD REPORT COMPLETE ===');
//     console.log('Final report:', newReport);
    
//     return newReport;
//   } catch (error) {
//     console.error("=== UPLOAD REPORT ERROR ===");
//     console.error("Error details:", error);
//     throw error;
//   }
// } 


import { ReportModel } from "./report.model";
import { uploadImgToCloudinary } from "../../utils/cloudinary";
import { IReport } from "./report.interface";

const uploadReport = async (patientId: string, files: Express.Multer.File[]): Promise<IReport> => {
  try {
    const uploadedFiles: Record<string, string[]> = {};

    // 🖼️ Handle uploaded files - USE THE EXACT SAME PATTERN as patient registration
    if (files) {
      for (const file of files) {
        const fieldName = "reports"; // Fixed field name for reports
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

    if (!uploadedFiles.reports || uploadedFiles.reports.length === 0) {
      throw new Error("No files were successfully uploaded");
    }

    // 💾 Save - use the exact same pattern
    const newReport = await ReportModel.create({
      patientId: patientId.trim(),
      reports: uploadedFiles.reports
    });

    return newReport;

  } catch (error) {
    console.error("Error in uploadReport service:", error);
    throw error;
  }
}

const getReports = async (patientId: string): Promise<IReport[]> => {
  try {
    if (!patientId?.trim()) {
      throw new Error("Valid patient ID is required");
    }

    return await ReportModel.find({ patientId: patientId.trim() });
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
}

export const reportService = {
  uploadReport,
  getReports
};