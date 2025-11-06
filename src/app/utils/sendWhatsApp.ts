import axios from "axios";

export const sendWhatsApp = async (phone: string, message: string) => {
  // Example using Twilio WhatsApp API
  const TWILIO_URL = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
  
  await axios.post(
    TWILIO_URL,
    new URLSearchParams({
      From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      To: `whatsapp:${phone}`,
      Body: message,
    }),
    {
      auth: {
        username: process.env.TWILIO_ACCOUNT_SID!,
        password: process.env.TWILIO_AUTH_TOKEN!,
      },
    }
  );
};
