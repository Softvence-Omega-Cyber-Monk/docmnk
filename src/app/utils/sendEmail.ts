import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, message: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_USER_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"HealthCare System" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: `<p>${message}</p>`,
  });
};
