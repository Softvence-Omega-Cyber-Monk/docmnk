import { model, Schema } from "mongoose";
import { ICamp } from "./eventManagement.interface";

const campSchema = new Schema<ICamp>(
  {
    campName: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ["Ongoing", "Upcoming", "Completed"], required: true },
    assignAdmin: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const CampModel = model("camps", campSchema);
