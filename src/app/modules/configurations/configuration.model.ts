import { Schema, model, Document } from "mongoose";
import { IConfiguration, IField } from "./configuration.interface";

export interface IConfigurationModel extends IConfiguration, Document {}

// Reusable Option Schema (for nested checkbox structures)
const OptionSchema = new Schema(
  {
    label: { type: String },
    value: { type: String },

    fieldName: { type: String },
    fieldType: {
      type: String,
      enum: [
        "text",
        "number",
        "date",
        "select",
        "checkbox",
        "radio",
        "textarea",
        "file",
      ],
    },
    placeholder: { type: String },

    // ⛔ allows nested sub-options
    options: {
      type: Array,
      default: [],
    },
  },
  { _id: false }
);

const FieldSchema = new Schema<IField>(
  {
    fieldName: { type: String, required: true },

    fieldType: {
      type: String,
      enum: [
        "text",
        "number",
        "date",
        "select",
        "checkbox",
        "radio",
        "textarea",
        "file",
      ],
      required: true,
    },

    isRequired: { type: Boolean, default: false, set: () => false },

    placeholder: { type: String },

    // ⭐ MAIN FIX — Supports ANY nested options structure
    options: {
      type: [OptionSchema],
      default: [],
      validate: {
        validator: function (v: any[]) {
          // select & radio must have label + value
          if (this.fieldType === "select" || this.fieldType === "radio") {
            return v.every((opt) => opt.label && opt.value);
          }

          // checkbox supports nested fields
          if (this.fieldType === "checkbox") {
            return v.every(
              (c) =>
                c.fieldName &&
                c.fieldType &&
                [
                  "text",
                  "number",
                  "date",
                  "textarea",
                  "file",
                  "checkbox", // nested checkbox allowed
                ].includes(c.fieldType)
            );
          }

          return true;
        },
        message: "Invalid options format.",
      },
    },

    order: { type: Number, default: 0 },

    active: { type: Boolean, default: true },
  },
  { _id: false }
);

const ConfigurationSchema = new Schema<IConfigurationModel>(
  {
    sectionName: { type: String, required: true, unique: true },

    fields: {
      type: [FieldSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Configuration = model<IConfigurationModel>(
  "Configuration",
  ConfigurationSchema
);
