import { ReportModel } from "./report.model";
import { uploadImgToCloudinary } from "../../utils/cloudinary";
import { IReport } from "./report.interface";
import { PatientManagementModel } from "../patientManagements/patientManagement.model";
import { getPatientModel } from "../patientRegistration/patientRegistration.model";
import status from "http-status";

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


/* =======================================================
   EXTRACT PATIENT NAME
   Only pick the actual patient "Name" field from Registration
======================================================= */
const extractPatientName = (registration: any): string => {
  if (!registration || typeof registration !== "object") return "Unknown";

  // Prefer 'Name' or 'Full Name' fields explicitly
  const possibleFields = ["Name", "Full Name", "PatientName", "patientName", "name", "fullName", "patientname", "fullname"];
  for (const field of possibleFields) {
    if (registration[field] && typeof registration[field] === "string" && registration[field].trim()) {
      return registration[field].trim();
    }
  }

  return "Unknown";
};

/* =======================================================
   GET REPORTS BY PATIENT
======================================================= */
const getReports = async (patientId: string): Promise<any[]> => {
  const PatientModel = await getPatientModel();
  const cleanId = patientId.trim();

  const patient = await PatientModel.findById(cleanId);
  if (!patient) throw new Error("Patient not found");

  const patientName = extractPatientName(patient.Registration);
  const campName = patient.campName || null;
  const campId = patient.campId || null;

  const reports = await ReportModel.find({ patientId: cleanId }).sort({ createdAt: -1 });

  return reports.map((rep) => ({
    reportId: rep._id,
    patientId: cleanId,
    patientName,
    campName,
    campId,
    reports: rep.reports || [],
    status: rep.status || false,
    createdAt: rep.createdAt,
    updatedAt: rep.updatedAt,
  }));
};

/* =======================================================
   GET ALL REPORTS
======================================================= */
const getAllReports = async (): Promise<any[]> => {
  const PatientModel = await getPatientModel();
  const reports = await ReportModel.find().sort({ createdAt: -1 });

  // Preload all patients in one query
  const patientIds = reports.map(r => r.patientId);
  const patients = await PatientModel.find({ _id: { $in: patientIds } });

  // Map patients by _id (cast to string)
  const patientMap: Record<string, any> = {};
  patients.forEach(p => {
    const id = String(p._id); // ✅ cast _id to string
    patientMap[id] = p;
  });

  return reports.map((rep) => {
    const patient = patientMap[String(rep.patientId)] || {};
    return {
      reportId: rep._id,
      patientId: rep.patientId,
      patientName: extractPatientName(patient.Registration),
      campName: patient.campName || null,
      campId: patient.campId || null,
      reports: rep.reports || [],
      status: rep.status,
      createdAt: rep.createdAt,
      updatedAt: rep.updatedAt,
    };
  });
};

// const getReportsByUserId = async (userId: string) => {
//   if (!userId) {
//     throw new Error("userId is required");
//   }

//   const Patient = await getPatientModel();

//   // Step 1: Get all patients created by this user
//   const patients = await Patient.find({ userId });

//   if (!patients || patients.length === 0) {
//     return []; // no patients under this user
//   }

//   // Step 2: Extract patientIds
//   const patientIds = patients.map((p: any) => p._id.toString());

//   // Step 3: Get all reports for these patientIds
//   const reports = await ReportModel.find({
//     patientId: { $in: patientIds },
//     status: true, // only reports with status true
//   }).lean();

//   return reports;
// };


const getReportsByUserId = async (userId: string) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  const Patient = await getPatientModel();

  // Step 1: Get all patients created by this user
  const patients = await Patient.find({ userId }).lean();

  if (!patients || patients.length === 0) {
    return []; // no patients under this user
  }

  // Step 2: Extract patientIds
  const patientIds = patients.map((p: any) => String(p._id));

  // Step 3: Get all reports for these patientIds with status=true
  const reports = await ReportModel.find({
    patientId: { $in: patientIds },
    status: true,
  }).lean();

  // Step 4: Build a map of patient info
  const patientMap: Record<string, { name: string; campName: string }> = {};
  patients.forEach((p: any) => {
    const registration = p.Registration || {};

    // Try all possible name fields
    const name =
      registration.name ||
      registration.Name ||
      registration.fullName ||
      registration.patientName ||
      "";

    patientMap[String(p._id)] = {
      name,
      campName: p?.campName || "",
    };
  });

  // Step 5: Merge patient info into each report
  const finalReports = reports.map((r: any) => ({
    ...r,
    patientName: patientMap[r.patientId]?.name || null,
    campName: patientMap[r.patientId]?.campName || null,
  }));

  return finalReports;
};


const updateReportStatusService = async (patientId: string, status: boolean) => {
  const updatedReport = await ReportModel.findOneAndUpdate(
    { patientId },
    { status },
    { new: true }
  );

  return updatedReport;
};


export const reportService = {
  uploadReport,
  getReports,
  getAllReports,
  getReportsByUserId,
  updateReportStatusService,
};