// import { Schema, model, Document } from "mongoose";
// import { 
//   IPatientRegistration, 
//   IMedicalCondition, 
//   IMedicalHistory, 
//   ISmokingHistory, 
//   ITobaccoChewing, 
//   IBetelNutUse, 
//   IAlcoholUse, 
//   ISubstanceUse, 
//   ILifestyleAndSubstanceUse, 
//   IDietaryActivityAssessment,
//   IClinicalAssessment,
//   IVitalsBiometrics,
//   IArterialAssessment,
//   IVenousAssessment,
//   ILymphaticAssessment,
//   ISensoryTesting,
//   IFootAssessment,
//   IInvestigations,
//   IUlcerAssessment
// } from "./patientRegistration.interface";

// export interface IPatientRegistrationModel extends IPatientRegistration, Document {}

// // Sub-schema for medical condition
// const MedicalConditionSchema = new Schema<IMedicalCondition>(
//   {
//     isChecked: { type: Boolean, required: true },
//     durationYears: { type: Number },
//     treatmentStatus: {
//       type: String,
//       enum: ["On Treatment", "Not on Treatment", "Completed", "Unknown"],
//     },
//     lastCheckupDate: { type: Date },
//   },
//   { _id: false }
// );

// // Sub-schema for medical history
// const MedicalHistorySchema = new Schema<IMedicalHistory>(
//   {
//     diabetesMellitus: { type: MedicalConditionSchema},
//     hypertension: { type: MedicalConditionSchema },
//     dyslipidemia: { type: MedicalConditionSchema},
//     hypothyroid: { type: MedicalConditionSchema},
//     chronicKidneyDisease: { type: MedicalConditionSchema },
//     chronicLiverDisease: { type: MedicalConditionSchema },
//     stroke: { type: MedicalConditionSchema },
//     cardiovascularDisease: { type: MedicalConditionSchema },
//     drugAllergies: { type: String },
//     foodAllergies: { type: String },
//     otherComorbidities: { type: String },
//     surgicalHistory: { type: String },
//     currentActiveMedications: { type: String },
//     previousReports: [{ type: String }],
//   },
//   { _id: false, strict: false }
// );

// // Sub-schema for smoking history
// const SmokingHistorySchema = new Schema<ISmokingHistory>(
//   {
//     status: {
//       type: String,
//       enum: ["Current Smoker", "Former Smoker", "Never Smoked"],
//       required: true
//     },
//     cigarettes: {
//       numberOfCigarettesPerDay: { type: Number },
//       yearsSmoked: { type: Number },
//       packYears: { type: Number }
//     },
//     beedis: {
//       numberOfBeedisPerDay: { type: Number },
//       yearsSmoked: { type: Number }
//     }
//   },
//   { _id: false }
// );

// // Sub-schema for tobacco chewing
// const TobaccoChewingSchema = new Schema<ITobaccoChewing>(
//   {
//     type: {
//       type: String,
//       enum: ["Cigarettes", "Beedis", "Chewing Tobacco", "Khatri", "Other"],
//       required: true
//     },
//     brand: { type: String },
//     amountPerDay: { type: Number },
//     yearsOfUse: { type: Number }
//   },
//   { _id: false }
// );

// // Sub-schema for betel nut use
// const BetelNutUseSchema = new Schema<IBetelNutUse>(
//   {
//     type: {
//       type: String,
//       enum: ["Betel Nut", "Pan", "Betel Leaf", "Other"],
//       required: true
//     },
//     amountPerDay: { type: Number },
//     yearsOfUse: { type: Number }
//   },
//   { _id: false }
// );

// // Sub-schema for alcohol use
// const AlcoholUseSchema = new Schema<IAlcoholUse>(
//   {
//     unitsPerWeek: { type: Number }
//   },
//   { _id: false }
// );

// // Sub-schema for other substances
// const OtherSubstanceSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     frequency: { type: String },
//     yearsOfUse: { type: Number },
//     route: { type: String },
//     treatmentStatus: {
//       type: String,
//       enum: ["On Treatment", "Not on Treatment", "Completed", "Unknown"]
//     }
//   },
//   { _id: false }
// );

// // Sub-schema for substance use
// const SubstanceUseSchema = new Schema<ISubstanceUse>(
//   {
//     otherSubstances: [OtherSubstanceSchema]
//   },
//   { _id: false }
// );

// // Sub-schema for lifestyle and substance use
// const LifestyleAndSubstanceUseSchema = new Schema<ILifestyleAndSubstanceUse>(
//   {
//     smokingHistory: { type: SmokingHistorySchema },
//     tobaccoChewing: [TobaccoChewingSchema],
//     betelNutUse: [BetelNutUseSchema],
//     alcoholUse: { type: AlcoholUseSchema },
//     substanceUse: { type: SubstanceUseSchema }
//   },
//   { _id: false }
// );

// // Sub-schema for current dietary information
// const CurrentDietarySchema = new Schema(
//   {
//     typicalMeals: { type: String },
//     eatingHabits: { type: String }
//   },
//   { _id: false }
// );

// // Sub-schema for physical activity
// const PhysicalActivitySchema = new Schema(
//   {
//     activityLevel: {
//       type: String,
//       enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extremely Active"]
//     },
//     sleepHoursPerNight: { 
//       type: Number,
//       min: 0,
//       max: 24
//     },
//     hasMobilityLimitations: { type: Boolean },
//     interestedInGuidedExercise: { type: Boolean },
//     exerciseFrequency: { type: String },
//     exerciseType: { type: String }
//   },
//   { _id: false }
// );

// // Sub-schema for dietary and activity assessment
// const DietaryActivityAssessmentSchema = new Schema<IDietaryActivityAssessment>(
//   {
//     dietPreference: {
//       type: String,
//       enum: ["Vegetarian", "Non-Vegetarian", "Vegan", "Other"]
//     },
//     foodAllergies: [{ type: String }],
//     medicationAllergies: [{ type: String }],
//     currentDietary: { type: CurrentDietarySchema },
//     physicalActivity: { type: PhysicalActivitySchema }
//   },
//   { _id: false }
// );

// // Sub-schema for vitals and biometrics
// const VitalsBiometricsSchema = new Schema<IVitalsBiometrics>(
//   {
//     weight: { type: Number },
//     height: { type: Number },
//     bmi: { type: Number },
//     temperature: { type: Number },
//     bpSystolic: { type: Number },
//     bpDiastolic: { type: Number },
//     heartRate: { type: Number },
//     spO2: { type: Number },
//     rbs: { type: Number }
//   },
//   { _id: false }
// );

// // Sub-schema for peripheral pulses
// const PeripheralPulsesSchema = new Schema(
//   {
//     femoral: { type: String, enum: ["Normal", "Absent", "Diminished", "Bounding"] },
//     popliteal: { type: String, enum: ["Normal", "Absent", "Diminished", "Bounding"] },
//     dorsalisPedis: { type: String, enum: ["Normal", "Absent", "Diminished", "Bounding"] },
//     posteriorTibial: { type: String, enum: ["Normal", "Absent", "Diminished", "Bounding"] }
//   },
//   { _id: false }
// );

// // Sub-schema for arterial assessment
// const ArterialAssessmentSchema = new Schema<IArterialAssessment>(
//   {
//     affectedLimb: { type: String, enum: ["Both", "Right", "Left"] },
//     symptoms: {
//       restPain: { type: Boolean },
//       claudication: { type: Boolean }
//     },
//     skinChanges: {
//       pallor: { type: Boolean },
//       rubor: { type: Boolean },
//       cyanosis: { type: Boolean },
//       coolness: { type: Boolean },
//       atrophy: { type: Boolean },
//       hairLoss: { type: Boolean },
//       nailChanges: { type: Boolean }
//     },
//     peripheralPulses: {
//       right: { type: PeripheralPulsesSchema },
//       left: { type: PeripheralPulsesSchema }
//     },
//     ankleBrachialIndex: {
//       right: { type: Number },
//       left: { type: Number }
//     },
//     abiTestPerformed: { type: Boolean }
//   },
//   { _id: false }
// );

// // Sub-schema for venous assessment
// const VenousAssessmentSchema = new Schema<IVenousAssessment>(
//   {
//     varicoseVeinsPresent: { type: Boolean },
//     edemaPresent: { type: Boolean },
//     skinChanges: {
//       hyperpigmentation: { type: Boolean },
//       lipodermatosclerosis: { type: Boolean },
//       venousUlcerPresent: { type: Boolean },
//       eczema: { type: Boolean },
//       atrophicBlanche: { type: Boolean }
//     },
//     chronicVenousInsufficiency: { type: Boolean }
//   },
//   { _id: false }
// );

// // Sub-schema for limb circumference
// const LimbCircumferenceSchema = new Schema(
//   {
//     thigh: { type: Number },
//     calf: { type: Number },
//     ankle: { type: Number }
//   },
//   { _id: false }
// );

// // Sub-schema for lymphatic assessment
// const LymphaticAssessmentSchema = new Schema<ILymphaticAssessment>(
//   {
//     lymphedemaPresent: { type: Boolean },
//     limbCircumference: {
//       right: { type: LimbCircumferenceSchema },
//       left: { type: LimbCircumferenceSchema }
//     },
//     stemmersSign: {
//       right: { type: Boolean },
//       left: { type: Boolean }
//     },
//     skinChanges: {
//       thickening: { type: Boolean },
//       hyperkeratosis: { type: Boolean },
//       papillomatosis: { type: Boolean },
//       fibrosis: { type: Boolean }
//     },
//     recurrentInfections: { type: Boolean },
//     otherFindings: {
//       otherDeformities: { type: String },
//       callusHyperkeratosis: { type: Boolean },
//       lymphorrhea: { type: Boolean }
//     },
//     lymphoedemaStage: { type: String, enum: ["Stage 0", "Stage I", "Stage II", "Stage III"] }
//   },
//   { _id: false }
// );

// // Sub-schema for sensory testing
// const SensoryTestingSchema = new Schema<ISensoryTesting>(
//   {
//     monofilamentTestPerformed: { type: Boolean },
//     vibrationSense: { type: Boolean },
//     proprioceptionTest: { type: Boolean },
//     hotColdTest: { type: Boolean },
//     proprioception: { type: Boolean },
//     motorWeakness: { type: Boolean }
//   },
//   { _id: false }
// );

// // Sub-schema for foot assessment
// const FootAssessmentSchema = new Schema<IFootAssessment>(
//   {
//     deformities: {
//       hammerToes: { type: Boolean },
//       clawToes: { type: Boolean },
//       charcotFoot: { type: Boolean },
//       bunions: { type: Boolean },
//       plantarMetatarsal: { type: Boolean }
//     },
//     otherDeformities: { type: String },
//     nailCondition: { type: String, enum: ["Normal", "Thickened", "Ingrown", "Fungal Infection"] },
//     callusHyperkeratosis: { type: Boolean },
//     activeUlcer: { type: Boolean },
//     previousUlceration: { type: Boolean },
//     appropriateFootwear: { type: Boolean }
//   },
//   { _id: false }
// );

// // Sub-schema for ulcer assessment
// const UlcerAssessmentSchema = new Schema<IUlcerAssessment>(
//   {
//     ulcerPresent: { type: Boolean },
//     details: {
//       location: { type: String },
//       size: { type: String },
//       depth: { type: String },
//       woundBed: { type: String },
//       exudate: { type: String },
//       surroundingSkin: { type: String }
//     }
//   },
//   { _id: false }
// );

// // Sub-schema for investigation reports
// const InvestigationReportsSchema = new Schema(
//   {
//     abiReport: [{ type: String }],
//     tcpo2Report: [{ type: String }],
//     monofilamentReport: [{ type: String }],
//     vibrothermReport: [{ type: String }]
//   },
//   { _id: false }
// );

// // Sub-schema for investigations
// const InvestigationsSchema = new Schema<IInvestigations>(
//   {
//     hba1c: { type: Number },
//     toePressure: { type: Number },
//     tcpo2: { type: Number },
//     reports: { type: InvestigationReportsSchema }
//   },
//   { _id: false }
// );

// // Sub-schema for clinical assessment
// const ClinicalAssessmentSchema = new Schema<IClinicalAssessment>(
//   {
//     presentingComplaint: { type: String },
//     vitalsBiometrics: { type: VitalsBiometricsSchema },
//     arterialAssessment: { type: ArterialAssessmentSchema },
//     venousAssessment: { type: VenousAssessmentSchema },
//     lymphaticAssessment: { type: LymphaticAssessmentSchema },
//     sensoryTesting: { type: SensoryTestingSchema },
//     footAssessment: { type: FootAssessmentSchema },
//     ulcerAssessment: { type: UlcerAssessmentSchema },
//     investigations: { type: InvestigationsSchema }
//   },
//   { _id: false }
// );

// // Main schema for patient registration
// const PatientRegistrationSchema = new Schema<IPatientRegistrationModel>(
//   {
//     fullName: { type: String, required: true },
//     gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
//     dateOfBirth: { type: Date, required: true },
//     age: { type: Number, required: true },
//     phoneNumber: { type: String, required: true },
//     email: {type: String, required: true},
//     occupation: { type: String },
//     address: { type: String, required: true },
//     status: {
//       type: String,
//       enum: [
//         "Wating for Registration",
//         "Waiting for Vitals",
//         "Waiting for Consultation",
//         "Screening Complete",
//       ],
//       default: "Wating for Registration",
//     },
//     campName: { type: String },
//     medicalHistory: { type: MedicalHistorySchema, required: true },
//     lifestyleAndSubstanceUse: { type: LifestyleAndSubstanceUseSchema},
//     dietaryActivityAssessment: { type: DietaryActivityAssessmentSchema },
//     clinicalAssessment: { type: ClinicalAssessmentSchema }
//   },
//   {
//     timestamps: true,
//   }
// );

// export const PatientRegistration = model<IPatientRegistrationModel>(
//   "PatientRegistration",
//   PatientRegistrationSchema
// );

// edit code dynamic


// import mongoose, { Schema, Document, Model } from "mongoose";
// import { Configuration } from "../configurations/configuration.model";
// import { IPatientRegistration } from "./patientRegistration.interface";

// export interface IPatientRegistrationModel extends IPatientRegistration, Document {}

// // Build schema dynamically from Configuration
// const buildPatientSchema = async (): Promise<Schema<IPatientRegistrationModel>> => {
//   const config = await Configuration.findOne({ sectionName: "Registration" });
//   if (!config) throw new Error("Registration configuration not found");

//   const schemaDefinition: any = {};

//   config.fields.forEach((field) => {
//     let type: any = String;

//     switch (field.fieldType) {
//       case "number": type = Number; break;
//       case "date": type = Date; break;
//       case "file": type = [String]; break;
//       case "checkbox": type = Boolean; break;
//       default: type = String;
//     }

//     schemaDefinition[field.fieldName] = { type, required: field.isRequired || false };
//   });

//   return new Schema(schemaDefinition, { timestamps: true });
// };

// export const getPatientModel = async (): Promise<Model<IPatientRegistrationModel>> => {
//   const modelName = "PatientRegistration";

//   if (mongoose.models[modelName]) {
//     return mongoose.models[modelName] as Model<IPatientRegistrationModel>;
//   }

//   const schema = await buildPatientSchema();
//   return mongoose.model<IPatientRegistrationModel>(modelName, schema);
// };

// export const PatientRegistration = async (): Promise<Model<IPatientRegistrationModel>> => {
//   const modelName = "PatientRegistration";

//   if (mongoose.models[modelName]) {
//     return mongoose.models[modelName] as Model<IPatientRegistrationModel>;
//   }

//   const schema = await buildPatientSchema();
//   return mongoose.model<IPatientRegistrationModel>(modelName, schema);
// };

// import mongoose, { Schema, Document, Model } from "mongoose";
// import { Configuration, IConfigurationModel } from "../configurations/configuration.model";

// export interface IPatientRegistrationModel extends Document {
//   [key: string]: any;
// }

// // Map field types
// const mapFieldType = (fieldType: string) => {
//   switch (fieldType) {
//     case "number": return Number;
//     case "date": return Date;
//     case "file": return [String];
//     case "checkbox": return Boolean;
//     default: return String;
//   }
// };

// // Build schema from all configuration sections
// export const buildPatientSchema = async (): Promise<Schema<IPatientRegistrationModel>> => {
//   const allConfigs: IConfigurationModel[] = await Configuration.find();

//   if (!allConfigs || allConfigs.length === 0) throw new Error("No configuration found");

//   const schemaDefinition: Record<string, any> = {};

//   allConfigs.forEach((section) => {
//     const sectionSchema: Record<string, any> = {};
//     section.fields.forEach((field) => {
//       schemaDefinition[field.fieldName] = {
//         type: mapFieldType(field.fieldType),
//         required: field.isRequired || false,
//       };
//     });
//     schemaDefinition[section.sectionName] = { type: new Schema(sectionSchema, { _id: false }) };
//   });
//   // Optional field
//   schemaDefinition.campName = { type: String, required: false };

//   return new Schema(schemaDefinition, { timestamps: true });
// };

// // Get dynamic patient model
// export const getPatientModel = async (): Promise<Model<IPatientRegistrationModel>> => {
//   const modelName = "PatientRegistration";
//   if (mongoose.models[modelName]) return mongoose.models[modelName] as Model<IPatientRegistrationModel>;

//   const schema = await buildPatientSchema();
//   return mongoose.model<IPatientRegistrationModel>(modelName, schema);
// };

import mongoose, { Schema, Document, Model } from "mongoose";
import { Configuration } from "../configurations/configuration.model";

export interface IPatientRegistrationModel extends Document {
  [key: string]: any;
}

// 🧠 Map field types from configuration → Mongoose schema types
const mapFieldType = (fieldType: string) => {
  switch (fieldType) {
    case "number": return Number;
    case "date": return Date;
    case "file": return [String];
    case "checkbox": return Boolean;
    default: return String;
  }
};

// 🧩 Build schema dynamically from Configuration collection
const buildPatientSchema = async (): Promise<Schema> => {
  const configurations = await Configuration.find();
  const schemaFields: Record<string, any> = {};

  for (const config of configurations) {
    const sectionName = config.sectionName;
    const sectionFields: Record<string, any> = {};

    for (const field of config.fields) {
      sectionFields[field.fieldName] = {
        type: mapFieldType(field.fieldType),
        required: field.isRequired || false,
      };
    }

    schemaFields[sectionName] = sectionFields;
  }

  // Common global fields (not section-based)
  schemaFields.campName = { type: String };
  schemaFields.status = { type: String, default: "Pending" };

  return new Schema(schemaFields, { timestamps: true });
};

// 🧠 Get dynamic patient model safely
export const getPatientModel = async (): Promise<Model<IPatientRegistrationModel>> => {
  const modelName = "PatientRegistration";
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName] as Model<IPatientRegistrationModel>;
  }

  const schema = await buildPatientSchema();
  return mongoose.model<IPatientRegistrationModel>(modelName, schema);
};
