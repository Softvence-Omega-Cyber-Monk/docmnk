import axios from "axios";

interface TwilioResponse {
  sid: string;
  status: string;
  to: string;
  from: string;
  body: string;
}

export const sendWhatsApp = async (phone: string, message: string) => {
  const phoneNumber = phone.startsWith("+") ? phone : `+${phone}`;

  const TWILIO_URL = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;

  try {
    const res = await axios.post<TwilioResponse>(
      TWILIO_URL,
      new URLSearchParams({
        From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        To: `whatsapp:${phoneNumber}`,
        Body: message,
      }),
      {
        auth: {
          username: process.env.TWILIO_ACCOUNT_SID!,
          password: process.env.TWILIO_AUTH_TOKEN!,
        },
      }
    );

    console.log(`✅ WhatsApp sent to ${phoneNumber}: SID=${res.data.sid}`);
  } catch (err: any) {
    console.error(
      `❌ WhatsApp send failed to ${phoneNumber}:`,
      err.response?.data || err.message
    );
  }
};
