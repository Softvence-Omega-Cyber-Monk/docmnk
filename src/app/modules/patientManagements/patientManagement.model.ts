import { model, Schema } from "mongoose";
import { IpatientManagement } from "./patientManagement.interface";

const patientManagementSchema = new Schema<IpatientManagement>(
  {
    patientId: { type: String, required: true },
    patientName: { type: String },
    status: {
      type: String,
      enum: [
        "Wating for Registration",
        "Waiting for Vitals",
        "Waiting for Consultation",
        "Screening Complete",
      ],
      default: "Wating for Registration",
    },
    waitTime: { type: String, required: true },
    complianceStatus: { type: String, enum: ["Complete", "Pending"] },
  },
  {
    versionKey: false,
    timestamps: true, // adds createdAt and updatedAt
  }
);

export const PatientManagementModel = model(
  "patientManagements",
  patientManagementSchema
);
