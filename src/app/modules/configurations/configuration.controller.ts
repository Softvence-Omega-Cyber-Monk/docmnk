import { Request, Response } from "express";
import { configurationService } from "./configuration.service";
import { PatientRegistration } from "../patientRegistration/patientRegistration.model";

const createConfiguration = async (req: Request, res: Response) => {
  try {
    const { type } = req.params; // registration | consultation | vital-check
    const { phoneNumber, ...rest } = req.body;

    // 1️⃣ Create configuration record
    const payload = { ...rest, phoneNumber, type };
    const data = await configurationService.createConfiguration(payload);

    // 2️⃣ Update patient status based on configuration type
    if (type === "registration" && phoneNumber) {
      await PatientRegistration.updateMany(
        { phoneNumber },
        { $set: { status: "Waiting for Vitals" } }
      );
    }

    if (type === "vital-check" && phoneNumber) {
      await PatientRegistration.updateMany(
        { phoneNumber },
        { $set: { status: "Waiting for Consultation" } }
      );
    }

    if (type === "consultation" && phoneNumber) {
      await PatientRegistration.updateMany(
        { phoneNumber },
        { $set: { status: "Screening Complete" } }
      );
    }

    res.status(201).json({
      success: true,
      message: `✅ Configuration for ${type} created successfully`,
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message:
        error.message ||
        `Failed to create configuration for ${req.params.type}`,
    });
  }
};

export const configurationController = {
  createConfiguration,
};
