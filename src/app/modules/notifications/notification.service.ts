// import { NotificationModel } from "./notification.model";
// import { sendEmail } from "../../utils/sendEmail";
// import { sendWhatsApp } from "../../utils/sendWhatsApp";
// import { RecipientType } from "./notification.interface";
// import { getPatientModel } from "../patientRegistration/patientRegistration.model"; // assuming you have a patient model

// // 🟢 Create & optionally send notification
// const createNotification = async (data: any) => {
//   const notification = await NotificationModel.create(data);

//   // 🟢 Auto-send if status is SENT or SCHEDULED
//   if (data.status === "SENT" || data.status === "SCHEDULED") {
//     await sendNotification(notification);
//     notification.sentAt = new Date();
//     await notification.save();
//   }

//   console.log("✅ Notification created:", notification._id);
//   return notification;
// };

// // 🟡 Send notification logic (email + WhatsApp)
// export const sendNotification = async (notificationData: any) => {
//   let totalRecipients = 0;
//   let successfulSends = 0;
//   let failedSends = 0;
//   const errors: string[] = [];
//   let recipientsList: any[] = [];

//   console.log("📩 Notification trigger started:", notificationData._id);
//   console.log("Recipients type:", notificationData.recipients.type);

//   try {
//     const PatientRegistration = await getPatientModel();
//     // 🧠 Step 1: Determine recipients
//     switch (notificationData.recipients.type) {
//       case RecipientType.SPECIFIC_PATIENTS:
//         recipientsList = await PatientRegistration.find({
//           _id: { $in: notificationData.recipients.patientIds || [] },
//         })
//           .select("email phoneNumber fullName")
//           .lean();
//         break;

//       case RecipientType.ALL_PATIENTS:
//         recipientsList = await PatientRegistration.find({})
//           .select("email phoneNumber fullName")
//           .lean();
//         break;

//       case RecipientType.ALL_PATIENTS_WITH_UPCOMING_APPOINTMENTS:
//         recipientsList = await PatientRegistration.find({
//           "upcomingAppointments.0": { $exists: true },
//         })
//           .select("email phoneNumber fullName")
//           .lean();
//         break;

//       case RecipientType.PATIENTS_BY_CONDITION:
//         const conditions = notificationData.recipients.filters?.conditions || [];
//         recipientsList = await PatientRegistration.find({
//           condition: { $in: conditions },
//         })
//           .select("email phoneNumber fullName")
//           .lean();
//         break;

//       default:
//         recipientsList = [];
//     }

//     totalRecipients = recipientsList.length;
//     console.log("Recipients list count:", totalRecipients);

//     if (totalRecipients === 0) {
//       console.warn("⚠️ No recipients found for this notification.");
//       return {
//         notificationId: notificationData._id,
//         totalRecipients: 0,
//         successfulSends: 0,
//         failedSends: 0,
//         sendDate: new Date(),
//         errors: ["No recipients found"],
//       };
//     }

//     // 📨 Step 2: Loop through recipients
//     for (const recipient of recipientsList) {
//       const email = recipient.email || null;
//       const phone = recipient.phoneNumber || null;

//       console.log("--------------------------------------------------");
//       console.log("👤 Sending to:", { email, phone });

//       if (!email && !phone) {
//         console.warn("⚠️ No email or phone found for this recipient. Skipping...");
//         failedSends++;
//         continue;
//       }

//       try {
//         // Send Email
//         if (email) {
//           console.log(`📧 Sending email to ${email}`);
//           await sendEmail(email, notificationData.subject, notificationData.message);
//           console.log(`✅ Email sent successfully to ${email}`);
//         }

//         // Send WhatsApp
//         if (phone) {
//           console.log(`💬 Sending WhatsApp message to ${phone}`);
//           await sendWhatsApp(phone, notificationData.message);
//           console.log(`✅ WhatsApp sent successfully to ${phone}`);
//         }

//         successfulSends++;
//       } catch (err: any) {
//         failedSends++;
//         const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
//         errors.push(errorMsg);
//         console.error(`❌ Failed to send to ${email || phone}:`, errorMsg);
//       }
//     }

//     console.log("📦 Notification send completed!");
//   } catch (outerErr: any) {
//     console.error("🚨 Error while sending notification:", outerErr.message);
//     errors.push(outerErr.message);
//   }

//   return {
//     notificationId: notificationData._id,
//     totalRecipients,
//     successfulSends,
//     failedSends,
//     sendDate: new Date(),
//     errors,
//   };
// };

import { NotificationModel } from "./notification.model";
import { sendEmail } from "../../utils/sendEmail";
import { RecipientType, NotificationStatus } from "./notification.interface";
import { getPatientModel } from "../patientRegistration/patientRegistration.model";
import { Configuration } from "../configurations/configuration.model";
import { sendWhatsApp } from "../../utils/sendWhatsApp"; // Updated WhatsApp utility

// 🟢 Create & optionally send notification
export const createNotification = async (data: any) => {
  const notification = await NotificationModel.create(data);

  // Auto-send if status is SENT or SCHEDULED
  if (
    data.status === NotificationStatus.SENT ||
    data.status === NotificationStatus.SCHEDULED
  ) {
    const sendResult = await sendNotification(notification);
    notification.sentAt = new Date();
    notification.sendSummary = sendResult; // ✅ Save send summary
    await notification.save();
  }

  console.log("✅ Notification created:", notification._id);
  return notification;
};

// 🟡 Send notification logic (email + WhatsApp)
export const sendNotification = async (notificationData: any) => {
  let totalRecipients = 0;
  let successfulSends = 0;
  let failedSends = 0;
  const errors: string[] = [];
  let recipientsList: any[] = [];

  console.log("📩 Notification trigger started:", notificationData._id);

  try {
    const PatientRegistration = await getPatientModel();

    // 🔹 Step 1: Determine recipients
    switch (notificationData.recipients.type) {
      case RecipientType.SPECIFIC_PATIENTS:
        recipientsList = await PatientRegistration.find({
          _id: { $in: notificationData.recipients.patientIds || [] },
        }).lean();
        break;

      case RecipientType.ALL_PATIENTS:
        recipientsList = await PatientRegistration.find({}).lean();
        break;

      case RecipientType.ALL_PATIENTS_WITH_UPCOMING_APPOINTMENTS:
        recipientsList = await PatientRegistration.find({
          "upcomingAppointments.0": { $exists: true },
        }).lean();
        break;

      case RecipientType.PATIENTS_BY_CONDITION:
        const conditions =
          notificationData.recipients.filters?.conditions || [];
        recipientsList = await PatientRegistration.find({
          "Vital Check.disease": { $in: conditions },
        }).lean();
        break;

      default:
        recipientsList = [];
    }

    totalRecipients = recipientsList.length;
    console.log("Recipients list count:", totalRecipients);

    if (totalRecipients === 0) {
      console.warn("⚠️ No recipients found for this notification.");
      return {
        notificationId: notificationData._id,
        totalRecipients: 0,
        successfulSends: 0,
        failedSends: 0,
        sendDate: new Date(),
        errors: ["No recipients found"],
      };
    }

    // 🔹 Step 2: Get dynamic section for email/phone from configuration
    const configs = await Configuration.find();
    const contactSection = configs.find((section) =>
      section.fields.some((f) => ["email", "phoneNumber"].includes(f.fieldName))
    );
    const sectionName = contactSection?.sectionName;

    if (!sectionName) {
      console.error("🚨 No section contains email/phoneNumber fields!");
      return {
        notificationId: notificationData._id,
        totalRecipients,
        successfulSends,
        failedSends: totalRecipients,
        sendDate: new Date(),
        errors: ["No email/phone section found in configuration"],
      };
    }

    // 🔹 Step 3: Loop through recipients
    for (const recipient of recipientsList) {
      const email = recipient[sectionName]?.email || null;
      let phone = recipient[sectionName]?.phoneNumber || null;
      const name = recipient[sectionName]?.fullName || "Unknown";

      console.log("--------------------------------------------------");
      console.log("👤 Sending to:", { email, phone, name });

      if (!email && !phone) {
        console.warn(
          "⚠️ No email or phone found for this recipient. Skipping..."
        );
        failedSends++;
        continue;
      }

      // 🔹 Send Email
      if (email) {
        try {
          await sendEmail(
            email,
            notificationData.subject,
            notificationData.message
          );
          console.log(`✅ Email sent successfully to ${email}`);
        } catch (err: any) {
          failedSends++;
          const errorMsg = err.response?.data
            ? JSON.stringify(err.response.data)
            : err.message;
          errors.push(`Email to ${email}: ${errorMsg}`);
          console.error(`❌ Failed email to ${email}:`, errorMsg);
        }
      }

      // 🔹 Send WhatsApp
      if (phone) {
        try {
          // Remove any leading '+' or 'whatsapp:' to avoid double prefix
          phone = phone.replace(/^(\+?whatsapp:)?/, "");
          phone = `whatsapp:${phone}`; // Ensure correct Twilio format

          await sendWhatsApp(phone, notificationData.message);
          console.log(`✅ WhatsApp sent successfully to ${phone}`);
        } catch (err: any) {
          failedSends++;
          const errorMsg = err.response?.data
            ? JSON.stringify(err.response.data)
            : err.message;
          errors.push(`WhatsApp to ${phone}: ${errorMsg}`);
          console.error(`❌ Failed WhatsApp to ${phone}:`, errorMsg);
        }
      }

      successfulSends++;
    }

    console.log("📦 Notification send completed!");
  } catch (outerErr: any) {
    console.error("🚨 Error while sending notification:", outerErr.message);
    errors.push(outerErr.message);
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
