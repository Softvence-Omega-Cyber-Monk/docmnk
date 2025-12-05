import { Schema, model } from "mongoose";
import { IReport } from "./report.interface";

const reportSchema = new Schema<IReport>(
  {
    patientId: { type: String, required: true },
    patientName: { type: String },
    campId: { type: String },
    campName: { type: String },
    reports: { type: [String], required: true },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ReportModel = model<IReport>("Report", reportSchema);
