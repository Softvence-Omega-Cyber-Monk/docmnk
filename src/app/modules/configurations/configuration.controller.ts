import { Request, Response } from "express";
import { configurationService } from "./configuration.service";
import { success } from "zod";
import { Message } from "twilio/lib/twiml/MessagingResponse";

const createOrUpdateConfiguration = async (req: Request, res: Response) => {
  try {
    const { sectionName, fields } = req.body;
    const data = await configurationService.createOrUpdate(sectionName, fields);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllConfigurations = async (req: Request, res: Response) => {
  try {
    const data = await configurationService.getAll();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getConfigurationBySection = async (req: Request, res: Response) => {
  try {
    const { sectionName } = req.params;
    const data = await configurationService.getBySection(sectionName);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addFieldToConfiguration = async (req: Request, res: Response) => {
  try {
    const { sectionName } = req.params;
    const field = req.body;
    const data = await configurationService.addField(sectionName, field);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateConfigurationField = async (req: Request, res: Response) => {
  try {
    const { sectionName, fieldName } = req.params;
    const updatedProperties = req.body;
    const data = await configurationService.updateConfigurationField(
      sectionName,
      fieldName,
      updatedProperties
    );
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteConfigurationField = async (req: Request, res: Response) => {
  try {
    const { sectionName, fieldName } = req.params;
    const data = await configurationService.deleteField(sectionName, fieldName);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteByName = async (req: Request, res: Response) => {
  try {
    const { sectionName } = req.params;
    const deleted = await configurationService.deleteSectionByName(sectionName);
    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: deleted,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Failed to delete section",
    });
  }
};

export const configurationController = {
  createOrUpdateConfiguration,
  getAllConfigurations,
  getConfigurationBySection,
  addFieldToConfiguration,
  updateConfigurationField,
  deleteConfigurationField,
  deleteByName,
};
