import { model, Schema } from "mongoose";
import { RecipientType, NotificationStatus, INotification, IRecipientFilter, IRecipient } from "./notification.interface";

const recipientFilterSchema = new Schema<IRecipientFilter>(
  {
    appointmentDateRange: {
      start: { type: Date },
      end: { type: Date }
    },
    conditions: [{ type: String }],
    locations: [{ type: String }],
    providers: [{ type: String }],
  },
  { _id: false }
);

const recipientSchema = new Schema<IRecipient>(
  {
    type: {
      type: String,
      enum: Object.values(RecipientType),
      required: true,
    },
    filters: recipientFilterSchema,
    patientIds: [{ type: String }]
  },
  { _id: false }
);

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    recipients: { type: recipientSchema, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.DRAFT,
    },
    scheduledFor: { type: Date },
    sentAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

export const NotificationModel = model<INotification>("notification", notificationSchema);
