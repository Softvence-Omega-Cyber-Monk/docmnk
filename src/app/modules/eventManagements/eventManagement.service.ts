import { CampModel } from "./eventManagement.model";
import { ICampCreate, ICampUpdate, ICamp } from "./eventManagement.interface";
import { PatientManagementModel } from "../patientManagements/patientManagement.model";
import { getPatientModel } from "../patientRegistration/patientRegistration.model";
import { Configuration } from "../configurations/configuration.model";

// Create a new camp
const createCamp = async (payload: ICampCreate): Promise<ICamp> => {
  const camp = await CampModel.create(payload);
  return camp;
};

// Get all camps
const getAllCamps = async (): Promise<ICamp[]> => {
  const camps = await CampModel.find();
  return camps;
};

// Get a single camp by ID
const getSingleCamp = async (id: string): Promise<ICamp> => {
  const camp = await CampModel.findById(id);
  if (!camp) throw new Error("Camp not found");

  // // 🔄 Update totalScreened based on PatientManagement
  // const totalScreened = await PatientManagementModel.countDocuments({
  //   campId: camp._id.toString(),
  //   status: "Screening Complete",
  // });

  // // Only update if it’s different
  // if (camp.totalScreened !== totalScreened) {
  //   camp.totalScreened = totalScreened;
  //   await camp.save();
  // }

    //Count all screened patients
  const totalScreened = await PatientManagementModel.countDocuments({
    campId: camp._id.toString(),
    status: "Screening Complete",
  });

  //Update totalScreened
  camp.totalScreened = totalScreened;

  //Calculate completion percentage
  if (camp.totalEnrolled && camp.totalEnrolled > 0) {
    const completionValue = (totalScreened / camp.totalEnrolled) * 100;
    camp.completion = Math.round(completionValue); // Round to nearest whole %
  } else {
    camp.completion = 0;
  }

  //Save updated values only if changed
  await camp.save();

  return camp;
};

// Update a camp by ID
const updateCamp = async (id: string, payload: ICampUpdate): Promise<ICamp> => {
  const camp = await CampModel.findByIdAndUpdate(id, payload, { new: true });
  if (!camp) throw new Error("Camp not found");
  return camp;
};

// Delete a camp by ID
const deleteCamp = async (id: string): Promise<{ message: string }> => {
  const camp = await CampModel.findByIdAndDelete(id);
  if (!camp) throw new Error("Camp not found");
  return { message: "Camp deleted successfully" };
};

const findNearbyCamps = async (latitude: number, longitude: number, maxDistance = 5000) => {
  const nearbyCamps = await CampModel.find({
    locationCoords: {
      $near: {
        $geometry: { type: "Point", coordinates: [longitude, latitude] },
        $maxDistance: maxDistance, // in meters
      },
    },
  });

  return nearbyCamps;
};

const getAllCampsSpecificUser = async (userId: string) => {
  try {
    const camps = await CampModel.find({ userId })
      .sort({ createdAt: -1 }); // latest first

    return camps;
  } catch (error) {
    console.error("Error fetching camps:", error);
    throw new Error("Unable to fetch camps");
  }
};

const isFilled = (value: any): boolean => {
  if (value === null || value === undefined) return false;

  // Empty string
  if (typeof value === "string" && value.trim() === "") return false;

  // Empty array
  if (Array.isArray(value) && value.length === 0) return false;

  // Object (checkbox, nested input etc)
  if (typeof value === "object") {
    return Object.values(value).some(v => isFilled(v));
  }

  return true;
};


export const getCampStationCompletion = async (campId: string) => {
  const Patient = await getPatientModel();
  const configs = await Configuration.find();

  if (!configs.length) return [];

  const patients = await Patient.find({ campId });
  const totalPatients = patients.length;

  if (totalPatients === 0) return [];

  const completionStats: any[] = [];

  for (const section of configs) {
    const sectionName = section.sectionName;

    // Use ALL configured fields (NOT only required)
    const fields = section.fields.map((f: any) => f.fieldName);

    let totalFilledPercent = 0;

    patients.forEach(patient => {
      const sectionData = patient[sectionName] || {};

      let filledCount = 0;

      fields.forEach(field => {
        const value = sectionData[field];
        if (isFilled(value)) {
          filledCount++;
        }
      });

      // Completion for 1 patient for this section
      const onePatientCompletion =
        fields.length === 0 ? 0 : (filledCount / fields.length) * 100;

      totalFilledPercent += onePatientCompletion;
    });

    // Average completion across all patients
    const avgCompletion = Number(
      (totalFilledPercent / totalPatients).toFixed(1)
    );

    completionStats.push({
      section: sectionName,
      completion: avgCompletion,
    });
  }

  return completionStats;
};


export const EventManagementService = {
  createCamp,
  getAllCamps,
  getSingleCamp,
  updateCamp,
  deleteCamp,
  findNearbyCamps,
  getCampStationCompletion,
};
