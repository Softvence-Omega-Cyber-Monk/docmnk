// import { PatientRegistration } from "./patientRegistration.model";
// import { IClinicalAssessment, IDietaryActivityAssessment, IPatientRegistration } from "./patientRegistration.interface";
// import e from "express";

// const createPatientRegistration = async (
//   payload: IPatientRegistration
// ) => {
//   const patient = await PatientRegistration.create(payload);
//   return patient;
// };

// const getSinglePatient = async (id: string) => {
//   const patient = await PatientRegistration.findById(id);

//   if (!patient) {
//     throw new Error("Patient not found");
//   } 

//   return patient;
// };

// // ✅ Get all patients
// const getAllPatients = async () => {
//   const patients = await PatientRegistration.find();
//   return patients;
// };

// // Update medical history
// const updateMedicalHistory = async (id: string, updateData: any) => {
//   const patient = await PatientRegistration.findByIdAndUpdate(
//     id,
//     { $set: { medicalHistory: updateData } },
//     { new: true }
//   );
//   if (!patient) {
//     throw new Error("Patient not found");
//   }
//   return patient;
// };

// // update lifestyle modification
// const updateLifestyleAndSubstanceUse = async (id: string, lifestyleData: any) => {
//   const patient = await PatientRegistration.findById(id);
//   if (!patient) {
//     throw new Error("Patient not found");
//   }

//   patient.lifestyleAndSubstanceUse = {
//     ...patient.lifestyleAndSubstanceUse,
//     ...lifestyleData,
//   };

//   await patient.save();
//   return patient;
// };

// // Update dietaryActivityAssessment
// const updateDietaryActivityAssessmentService = async (
//   patientId: string,
//   dietaryData: IDietaryActivityAssessment
// ): Promise<IPatientRegistration | null> => {
//   const updatedPatient = await PatientRegistration.findByIdAndUpdate(
//     patientId,
//     { dietaryActivityAssessment: dietaryData },
//     { new: true }
//   );
//   return updatedPatient;
// };

// const updateClinicalAssessmentService = async (
//   patientId: string,
//   clinicalData: IClinicalAssessment
// ): Promise<IPatientRegistration | null> => {
//   const updatedPatient = await PatientRegistration.findByIdAndUpdate(
//     patientId,
//     { clinicalAssessment: clinicalData },
//     { new: true }
//   );

//   return updatedPatient;
// };


// export const PatientRegistrationService = {
//   createPatientRegistration,
//   getSinglePatient,
//   getAllPatients,
//   updateMedicalHistory,
//   updateLifestyleAndSubstanceUse,
//   updateDietaryActivityAssessmentService,
//   updateClinicalAssessmentService,
// };

import { getPatientModel } from "./patientRegistration.model";

export const createPatientRegistration = async (payload: any) => {
  const PatientModel = await getPatientModel();
  const patient = new PatientModel(payload);
  console.log("patient form", patient);
  return await patient.save();
};

export const getAllPatients = async () => {
  const PatientModel = await getPatientModel();
  return await PatientModel.find();
};

export const getPatientById = async (id: string) => {
  const PatientModel = await getPatientModel();
  return await PatientModel.findById(id);
};

export const updatePatient = async (id: string, payload: any) => {
  const PatientModel = await getPatientModel();
  const patient = await PatientModel.findByIdAndUpdate(id, payload, { new: true });
  if (!patient) throw new Error("Patient not found");
  return patient;
};

export const deletePatient = async (id: string) => {
  const PatientModel = await getPatientModel();
  const patient = await PatientModel.findByIdAndDelete(id);
  if (!patient) throw new Error("Patient not found");
  return patient;
};

export const saveFullReport = async (patientId: string, report: any) => {
  const Patient = await getPatientModel();

  const updated = await Patient.findByIdAndUpdate(
    patientId,
    {
      report: report,                    // store full report JSON
      reportGeneratedAt: new Date(),     // timestamp
      reportStatus: "Generated"
    },
    { new: true }
  );

  return updated;
};

export const getReportByPatientId = async (patientId: string) => {
  const Patient = await getPatientModel();

  const patient = await Patient.findById(patientId).select("report reportStatus reportGeneratedAt");

  return patient;
};

// List of possible dynamic name keys
const nameKeys = ["name", "fullName", "FullName", "Full Name", "patient_name"];

export const getAllReportsService = async () => {
  const Patient = await getPatientModel();

  // Fetch all patients that have a report
  const patientsWithReports = await Patient.find({ report: { $exists: true, $ne: null } })
    .sort({ reportGeneratedAt: -1 });

  // Map each patient to include a unified patientName
  const formattedReports = patientsWithReports.map((patient: any) => {
    const patientObj = patient.toObject();

    let patientName: string | null = null;

    // Loop through all sections to find a field that matches nameKeys
    for (const section of Object.keys(patientObj)) {
      const sectionData = patientObj[section];

      if (typeof sectionData === "object" && sectionData !== null) {
        for (const key of Object.keys(sectionData)) {
          if (nameKeys.includes(key)) {
            patientName = sectionData[key];
            break;
          }
        }
      }

      if (patientName) break;
    }

    return {
      _id: patientObj._id,
      patientName: patientName || null,
      report: patientObj.report,
      reportStatus: patientObj.reportStatus,
      reportGeneratedAt: patientObj.reportGeneratedAt
    };
  });

  return formattedReports;
};