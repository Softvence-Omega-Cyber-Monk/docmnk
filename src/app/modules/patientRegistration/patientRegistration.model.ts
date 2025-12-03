// import mongoose, { Schema, Document, Model } from "mongoose";
// import { Configuration } from "../configurations/configuration.model";

// export interface IPatientRegistrationModel extends Document {
//   [key: string]: any;
// }

// // 🧠 Map field types from configuration → Mongoose schema types
// const mapFieldType = (fieldType: string) => {
//   switch (fieldType) {
//     case "number":
//       return Number;
//     case "date":
//       return Date;
//     case "file":
//       return [String];
//     case "checkbox":
//       return Boolean;
//     default:
//       return String;
//   }
// };

// // 🧩 Build schema dynamically from Configuration collection
// const buildPatientSchema = async (): Promise<Schema> => {
//   const configurations = await Configuration.find();
//   const schemaFields: Record<string, any> = {};

//   for (const config of configurations) {
//     const sectionName = config.sectionName;
//     const sectionFields: Record<string, any> = {};

//     for (const field of config.fields) {
//       sectionFields[field.fieldName] = {
//         type: mapFieldType(field.fieldType),
//         required: field.isRequired || false,
//       };
//     }

//     schemaFields[sectionName] = sectionFields;
//   }

//   // Common global fields (not section-based)
//   schemaFields.campName = { type: String };
//   schemaFields.campId = { type: String };
//   schemaFields.status = { type: String};

//   schemaFields.report = { type: Schema.Types.Mixed };
//   schemaFields.reportGeneratedAt = { type: Date };
//   schemaFields.reportStatus = { type: String, default: "Not Generated" };

//   return new Schema(schemaFields, { timestamps: true });
// };

// // 🧠 Get dynamic patient model safely
// // export const getPatientModel = async (): Promise<
// //   Model<IPatientRegistrationModel>
// // > => {
// //   const modelName = "PatientRegistration";
// //   if (mongoose.models[modelName]) {
// //     return mongoose.models[modelName] as Model<IPatientRegistrationModel>;
// //   }

// //   const schema = await buildPatientSchema();
// //   return mongoose.model<IPatientRegistrationModel>(modelName, schema);
// // };
// export const getPatientModel = async (): Promise<
//   Model<IPatientRegistrationModel>
// > => {
//   const modelName = "PatientRegistration";

//   // ❗ Always delete old model to regenerate dynamic schema
//   if (mongoose.models[modelName]) {
//     delete mongoose.models[modelName];
//   }

//   const schema = await buildPatientSchema();
//   return mongoose.model<IPatientRegistrationModel>(modelName, schema);
// };

import mongoose, { Schema, Document, Model } from "mongoose";
import { Configuration } from "../configurations/configuration.model";

export interface IPatientRegistrationModel extends Document {
  [key: string]: any;
};

// 🧠 Map a configuration field to Mongoose type (recursive for nested checkboxes)
const mapFieldType = (field: any): any => {
  switch (field.fieldType) {
    case "number":
      return { type: Number, required: field.isRequired || false };
    case "date":
      return { type: Date, required: field.isRequired || false };
    case "file":
      return { type: [String], required: field.isRequired || false };
    case "checkbox":
      if (field.options && field.options.length > 0) {
        // nested checkboxes → create sub-schema recursively
        const subFields: Record<string, any> = {};
        field.options.forEach((opt: any) => {
          subFields[opt.fieldName] = mapFieldType(opt);
        });
        return { type: new Schema(subFields, { _id: false }), required: field.isRequired || false };
      }
      return { type: Boolean, required: field.isRequired || false };
    case "select":
    case "radio":
      return { type: String, required: field.isRequired || false };
    case "textarea":
    case "text":
    default:
      return { type: String, required: field.isRequired || false };
  }
};

// 🧩 Build dynamic patient schema from Configuration collection
const buildPatientSchema = async (): Promise<Schema> => {
  const configurations = await Configuration.find();
  const schemaFields: Record<string, any> = {};

  for (const config of configurations) {
    const sectionName = config.sectionName;
    const sectionFields: Record<string, any> = {};

    for (const field of config.fields) {
      sectionFields[field.fieldName] = mapFieldType(field);
    }

    // Nest section fields under sectionName
    schemaFields[sectionName] = { type: new Schema(sectionFields, { _id: false }), default: {} };
  }

  // Global fields
  schemaFields.campName = { type: String };
  schemaFields.campId = { type: String };
  schemaFields.status = { type: String };
  schemaFields.report = { type: Schema.Types.Mixed };
  schemaFields.reportGeneratedAt = { type: Date };
  schemaFields.reportStatus = { type: String, default: "Not Generated" };

  return new Schema(schemaFields, { timestamps: true });
};

// 🧠 Get or create dynamic Patient model safely
export const getPatientModel = async (): Promise<Model<IPatientRegistrationModel>> => {
  const modelName = "PatientRegistration";

  // Delete old model if exists (important for dynamic schema updates)
  if (mongoose.models[modelName]) {
    delete mongoose.models[modelName];
  }

  const schema = await buildPatientSchema();
  return mongoose.model<IPatientRegistrationModel>(modelName, schema);
};
