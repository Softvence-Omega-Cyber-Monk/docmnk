import { Schema, model, Document } from "mongoose";
import { Iconfiguration } from "./configuration.interface";

export interface IconfigurationModel extends Iconfiguration, Document {}

const configurationSchema = new Schema<IconfigurationModel>(
  {
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export const configurationModel = model<IconfigurationModel>(
  "configurations",
  configurationSchema
);
