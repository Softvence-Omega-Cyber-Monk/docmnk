import { CampModel } from "./eventManagement.model";
import { ICampCreate, ICampUpdate, ICamp } from "./eventManagement.interface";

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

export const EventManagementService = {
  createCamp,
  getAllCamps,
  getSingleCamp,
  updateCamp,
  deleteCamp,
};
