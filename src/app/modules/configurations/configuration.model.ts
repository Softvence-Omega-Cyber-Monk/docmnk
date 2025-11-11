// import { Schema, model, Document } from "mongoose";
// import { Iconfiguration } from "./configuration.interface";

// export interface IconfigurationModel extends Iconfiguration, Document {}

// const configurationSchema = new Schema<IconfigurationModel>(
//   {
//     fullName: { type: String, required: true },
//     dateOfBirth: { type: Date, required: true },
//     phoneNumber: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// export const configurationModel = model<IconfigurationModel>(
//   "configurations",
//   configurationSchema
// );


// src/modules/configuration/configuration.model.ts

// import { Schema, model, Document } from "mongoose";
// import { IConfiguration, IField } from "./configuration.interface";

// export interface IConfigurationModel extends IConfiguration, Document {}

// const FieldOptionSchema = new Schema(
//   {
//     label: { type: String, required: true },
//     value: { type: String, required: true },
//   },
//   { _id: false }
// );

// const FieldSchema = new Schema<IField>(
//   {
//     fieldName: { type: String, required: true },
//     fieldType: {
//       type: String,
//       enum: ["text", "number", "date", "select", "checkbox", "radio", "textarea", "file"],
//       required: true,
//     },
//     isRequired: { type: Boolean, default: false },
//     placeholder: { type: String },
//     options: [FieldOptionSchema],
//     order: { type: Number, default: 0 },
//     active: { type: Boolean, default: true },
//   },
//   { _id: false }
// );

// const ConfigurationSchema = new Schema<IConfigurationModel>(
//   {
//     sectionName: { type: String, required: true, unique: true },
//     fields: { type: [FieldSchema], default: [] },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const Configuration = model<IConfigurationModel>(
//   "Configuration",
//   ConfigurationSchema
// );

import { Schema, model, Document } from "mongoose";
import { IConfiguration, IField } from "./configuration.interface";

export interface IConfigurationModel extends IConfiguration, Document {}

const FieldSchema = new Schema<IField>(
  {
    fieldName: { type: String, required: true },
    fieldType: {
      type: String,
      enum: ["text","number","date","select","checkbox","radio","textarea","file"],
      required: true,
    },
    isRequired: { type: Boolean, default: false },
    placeholder: { type: String },
    options: [{ label: String, value: String }],
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { _id: false }
);

const ConfigurationSchema = new Schema<IConfigurationModel>(
  {
    sectionName: { type: String, required: true, unique: true },
    fields: { type: [FieldSchema], default: [] },
  },
  { timestamps: true }
);

export const Configuration = model<IConfigurationModel>("Configuration", ConfigurationSchema);

