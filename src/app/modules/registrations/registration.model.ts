import mongoose, { Schema, Document, Model } from "mongoose";
import { Configuration } from "../configurations/configuration.model";

export interface IPatientRegistrationModel extends Document {
  [key: string]: any; // dynamic sections
};

/**
 * 🔧 Map configuration field to proper Mongoose type
 */
const mapFieldType = (field: any): any => {
  switch (field.fieldType) {
    case "number":
      return { type: Number };
    case "date":
      return { type: Date };
    case "file":
      return { type: [String], default: [] };
    case "select":
    case "radio":
      return { type: String };
    case "checkbox":
      if (field.options && field.options.length > 0) {
        // Nested checkbox → recursive schema
        const nestedFields: Record<string, any> = {};
        field.options.forEach((opt: any) => {
          if (!opt.fieldName) return;
          nestedFields[opt.fieldName] = mapFieldType(opt);
        });
        return { type: new Schema(nestedFields, { _id: false, strict: false }), default: {} };
      }
      // For checkboxes without options, allow Boolean or Object
      return { type: Schema.Types.Mixed, default: {} };
    default:
      return { type: String };
  }
};

/**
 * 🔧 Build dynamic patient schema based on Configuration
 */
const buildDynamicPatientSchema = async (): Promise<Schema> => {
  const configurations = await Configuration.find();
  const sections: Record<string, any> = {};

  for (const config of configurations) {
    const sectionName = config.sectionName;
    const sectionFields: Record<string, any> = {};

    config.fields.forEach((field: any) => {
      sectionFields[field.fieldName] = mapFieldType(field);
    });

    sections[sectionName] = { type: new Schema(sectionFields, { _id: false, strict: false }), default: {} };
  }

  // Global fields
  sections.userId = { type: String };
  // sections.campId = { type: String };
  // sections.campName = { type: String };
  // sections.status = { type: String };
  // sections.reportStatus = { type: String, default: "Not Generated" };
  // sections.report = { type: Schema.Types.Mixed };
  // sections.reportApproved= { type: Boolean, default: false };
  // sections.reportGeneratedAt = { type: Date };

  return new Schema(sections, { timestamps: true, strict: false });
};

/**
 * 🔥 Return dynamic Patient model
 */
export const getPatientModel = async (): Promise<Model<IPatientRegistrationModel>> => {
  const modelName = "Registration";

  if (mongoose.models[modelName]) delete mongoose.models[modelName];

  const schema = await buildDynamicPatientSchema();
  return mongoose.model<IPatientRegistrationModel>(modelName, schema);
};
