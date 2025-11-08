// Production code
import twilio from "twilio";

// ✅ Use `twilio()` instead of `new Twilio()`
// The default import handles types correctly in production
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER!; // Example: "whatsapp:+880XXXXXXXXXX"

const client = twilio(accountSid, authToken);

export const sendWhatsApp = async (phone: string, message: string) => {
  try {
    // ✅ Ensure phone number is in correct format (+8801xxxxxx)
    const phoneNumber = phone.startsWith("+") ? phone : `+${phone}`;

    const response = await client.messages.create({
      from: whatsappNumber.startsWith("whatsapp:")
        ? whatsappNumber
        : `whatsapp:${whatsappNumber}`, // ✅ Avoid double prefix
      to: `whatsapp:${phoneNumber}`,
      body: message,
    });

    console.log(`✅ WhatsApp sent to ${phoneNumber}: SID=${response.sid}`);
    return response;
  } catch (err: any) {
    console.error(`❌ WhatsApp send failed to ${phone}:`, err?.message || err);
    throw err;
  }
};
