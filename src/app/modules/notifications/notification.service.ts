import { NotificationModel } from "./notification.model";
import { sendEmail } from "../../utils/sendEmail";
import { sendWhatsApp } from "../../utils/sendWhatsApp";
import { RecipientType } from "./notification.interface";
import { PatientRegistration } from "../patientRegistration/patientRegistration.model"; // assuming you have a patient model

// 🟢 Create & optionally send notification
const createNotification = async (data: any) => {
  const notification = await NotificationModel.create(data);

  // Send immediately if status is SENT or SCHEDULED
  if (data.status === "SENT" || data.status === "SCHEDULED") {
    await sendNotification(notification);
    notification.sentAt = new Date();
    await notification.save();
  }

  return notification;
};

// 🟡 Send notification logic (email + WhatsApp)
const sendNotification = async (notificationData: any) => {
  let totalRecipients = 0;
  let successfulSends = 0;
  let failedSends = 0;
  const errors: string[] = [];

  let recipientsList: any[] = [];

  switch (notificationData.recipients.type) {
    case RecipientType.SPECIFIC_PATIENTS:
      recipientsList = notificationData.recipients.patientIds || [];
      break;

    case RecipientType.ALL_PATIENTS:
      recipientsList = await PatientRegistration.find({}).select("email phone").lean();
      break;

    case RecipientType.ALL_PATIENTS_WITH_UPCOMING_APPOINTMENTS:
      recipientsList = await PatientRegistration.find({
        "upcomingAppointments.0": { $exists: true },
      }).select("email phone").lean();
      break;

    case RecipientType.PATIENTS_BY_CONDITION:
      const conditions = notificationData.recipients.filters?.conditions || [];
      recipientsList = await PatientRegistration.find({
        condition: { $in: conditions },
      }).select("email phone").lean();
      break;

    default:
      recipientsList = [];
      break;
  }

  totalRecipients = recipientsList.length;

  for (const recipient of recipientsList) {
    try {
      if (recipient.email) await sendEmail(recipient.email, notificationData.subject, notificationData.message);
      if (recipient.phone) await sendWhatsApp(recipient.phone, notificationData.message);
      successfulSends++;
    } catch (err: any) {
      failedSends++;
      errors.push(err.message);
    }
  }

  return {
    notificationId: notificationData._id,
    totalRecipients,
    successfulSends,
    failedSends,
    sendDate: new Date(),
    errors,
  };
};

// 🟠 Get all notifications
const getAllNotifications = async () => {
  return await NotificationModel.find().sort({ createdAt: -1 });
};

// 🔵 Get single notification
const getSingleNotification = async (id: string) => {
  return await NotificationModel.findById(id);
};

// 🔴 Delete notification
const deleteNotification = async (id: string) => {
  const notification = await NotificationModel.findByIdAndDelete(id);
  return notification;
};

export const NotificationService = {
  createNotification,
  sendNotification,
  getAllNotifications,
  getSingleNotification,
  deleteNotification,
};
