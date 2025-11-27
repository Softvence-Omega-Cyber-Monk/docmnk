// import { model, Schema } from "mongoose";
// import { ICamp } from "./eventManagement.interface";

// const campSchema = new Schema<ICamp>(
//   {
//     campName: { type: String, required: true },
//     location: { type: String, required: true },
//     status: {
//       type: String,
//       enum: ["Ongoing", "Upcoming", "Completed"]
//     },
//     assignAdmin: { type: String, required: true },
//     startDate: { type: Date, required: true },
//     endDate: { type: Date, required: true },
//     avgTime: { type: Number, required: true },
//     patientToday: { type: Number },
//     completion: { type: Number },
//     totalEnrolled: { type: Number },
//   },
//   {
//     versionKey: false,
//     timestamps: true,
//   }
// );

// export const CampModel = model("camps", campSchema);

import { model, Schema } from "mongoose";
import { ICamp } from "./eventManagement.interface";

import {
  updateCampStatusOnSave,
  updateCampStatusOnUpdate,
} from "./statusUpdate";

const campSchema = new Schema<ICamp>(
  {
    campName: { type: String, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["Ongoing", "Upcoming", "Completed"],
      default: "Upcoming",
    },
    assignAdmin: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    avgTime: { type: Number, required: true },
    patientToday: { type: Number },
    completion: { type: Number },
    totalEnrolled: { type: Number },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Middleware usage
campSchema.pre("save", updateCampStatusOnSave);
campSchema.pre(["findOneAndUpdate", "updateOne"], updateCampStatusOnUpdate);

export const CampModel = model("camps", campSchema);
