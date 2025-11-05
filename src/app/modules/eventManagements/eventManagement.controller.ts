import { Request, Response } from "express";
import { EventManagementService } from "./eventManagement.service";

// Create a new camp
const createCamp = async (req: Request, res: Response) => {
  try {
    const camp = await EventManagementService.createCamp(req.body);
    res.status(201).json(camp);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error creating camp" });
  }
};

// Get all camps
const getAllCamps = async (_req: Request, res: Response) => {
  try {
    const camps = await EventManagementService.getAllCamps();
    res.status(200).json(camps);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error fetching camps" });
  }
};

// Get a single camp by ID
const getSingleCamp = async (req: Request, res: Response) => {
  try {
    const camp = await EventManagementService.getSingleCamp(req.params.id);
    res.status(200).json(camp);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "Camp not found" });
  }
};

// Update a camp by ID
const updateCamp = async (req: Request, res: Response) => {
  try {
    const camp = await EventManagementService.updateCamp(req.params.id, req.body);
    res.status(200).json(camp);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "Camp not found" });
  }
};

// Delete a camp by ID
const deleteCamp = async (req: Request, res: Response) => {
  try {
    const result = await EventManagementService.deleteCamp(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "Camp not found" });
  }
};

export const EventManagementController = {
  createCamp,
  getAllCamps,
  getSingleCamp,
  updateCamp,
  deleteCamp,
};
