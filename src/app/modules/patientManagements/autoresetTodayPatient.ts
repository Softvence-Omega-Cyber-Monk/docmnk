import cron from "node-cron";
import {CampModel} from "../eventManagements/eventManagement.model"; // adjust the path to your CampModel

// Schedule a job to run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    await CampModel.updateMany({}, { patientToday: 0 });
    console.log("✅ patientToday reset for all camps at midnight");
  } catch (error) {
    console.error("❌ Error resetting patientToday:", error);
  }
});
