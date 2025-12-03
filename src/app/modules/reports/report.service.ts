import { ReportModel } from "./report.model";
import { uploadImgToCloudinary } from "../../utils/cloudinary";
import { IReport } from "./report.interface";
import { PatientManagementModel } from "../patientManagements/patientManagement.model";
import { getPatientModel } from "../patientRegistration/patientRegistration.model";

const uploadReport = async (
  patientId: string,
  files: Express.Multer.File[]
): Promise<IReport> => {
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
      reports: uploadedFiles.reports,
    });

    // 🔄 Update patientManagement status after report upload
    const updatedPatient = await PatientManagementModel.findOneAndUpdate(
      { patientId: patientId.trim() },
      { status: "Screening Complete" }, // Update to desired status
      { new: true }
    );

    if (!updatedPatient) {
      console.warn(
        `Patient with ID ${patientId} not found in PatientManagement`
      );
    }

    return newReport;
  } catch (error) {
    console.error("Error in uploadReport service:", error);
    throw error;
  }
};

// const getReports = async (patientId: string): Promise<any[]> => {
//   try {
//     const PatientModel = await getPatientModel();

//     const cleanId = patientId.trim();

//     // ✅ Fetch patient by _id (correct way)
//     const patient = await PatientModel.findById(cleanId);

//     if (!patient) {
//       throw new Error("Patient not found");
//     }

//     // Extract campName and patientName
//     const campName = patient.campName || null;
//     const patientName = extractPatientName(patient?.Registration);

//     // ✅ Fetch reports using patientId field in ReportModel
//     const reports = await ReportModel.find({ patientId: cleanId });

//     // Return structured data
//     const finalData = reports.map((rep) => ({
//       reportId: rep._id,
//       patientId: cleanId,
//       patientName,
//       campName,
//       reports: rep.reports,
//       createdAt: rep.createdAt,
//       updatedAt: rep.updatedAt,
//     }));

//     return finalData;
//   } catch (error) {
//     console.error("❌ Error fetching reports:", error);
//     throw error;
//   }
// };

// const getAllReports = async (): Promise<any[]> => {
//   try {
//     const PatientModel = await getPatientModel();

//     // Fetch all reports
//     const reports = await ReportModel.find().sort({ createdAt: -1 });

//     const finalData = [];

//     for (const rep of reports) {
//       const patientId = rep.patientId;

//       // Fetch patient info by _id
//       const patient = await PatientModel.findById(patientId);

//       finalData.push({
//         reportId: rep._id,
//         patientId,
//         patientName: patient?.Registration?.fullName || null,
//         campName: patient?.campName || null,
//         reports: rep.reports,
//         createdAt: rep.createdAt,
//         updatedAt: rep.updatedAt,
//       });
//     }

//     return finalData;
//   } catch (error) {
//     console.error("❌ Error fetching all reports:", error);
//     throw error;
//   }
// };

const extractPatientName = (reg: any) => {
  if (!reg) return null;

  const key = Object.keys(reg).find(k =>
    k.toLowerCase().includes("name" )
  );

  return key ? reg[key] : null;
};

const getReports = async (patientId: string): Promise<any[]> => {
  const PatientModel = await getPatientModel();
  const cleanId = patientId.trim();

  const patient = await PatientModel.findById(cleanId);
  if (!patient) throw new Error("Patient not found");

  const patientName = extractPatientName(patient?.Registration) || "Unknown";
  const campName = patient?.campName || null;

  const reports = await ReportModel.find({ patientId: cleanId });

  return reports.map((rep) => ({
    reportId: rep._id,
    patientId: cleanId,
    patientName,        // ✅ Must be here
    campName,
    reports: rep.reports,
    createdAt: rep.createdAt,
    updatedAt: rep.updatedAt,
  }));
};

const getAllReports = async (): Promise<any[]> => {
  try {
    const PatientModel = await getPatientModel();
    const reports = await ReportModel.find().sort({ createdAt: -1 });

    const finalData = [];

    for (const rep of reports) {
      const patient = await PatientModel.findById(rep.patientId);

      finalData.push({
        reportId: rep._id,
        patientId: rep.patientId,
        patientName: extractPatientName(patient?.Registration),
        campName: patient?.campName || null,
        reports: rep.reports,
        createdAt: rep.createdAt,
        updatedAt: rep.updatedAt,
      });
    }

    return finalData;
  } catch (error) {
    console.error("❌ Error fetching all reports:", error);
    throw error;
  }
};


export const reportService = {
  uploadReport,
  getReports,
  getAllReports,
};