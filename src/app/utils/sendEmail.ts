// import nodemailer from "nodemailer";

// export const sendEmail = async (to: string, subject: string, message: string) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.APP_USER_EMAIL,
//       pass: process.env.APP_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: `"Medixcamp HealthCare System" <${process.env.APP_USER_EMAIL}>`,
//     to,
//     subject,
//     html: `<p>${message}</p>`,
//   };

//   const info = await transporter.sendMail(mailOptions);
//   console.log(`✅ Email sent to ${to}: ${info.response}`);
// };

// import nodemailer from "nodemailer";

// export const sendEmail = async (
//   to: string,
//   subject: string,
//   message: string,
//   attachments: any[] = []
// ) => {
//   try {
//     // Validate required ENV variables
//     if (!process.env.APP_USER_EMAIL || !process.env.APP_PASSWORD) {
//       throw new Error("Email credentials are missing in environment variables.");
//     }

//     // Create reusable transporter
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,     // secure: false for TLS
//       secure: false,
//       auth: {
//         user: process.env.APP_USER_EMAIL,
//         pass: process.env.APP_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: {
//         name: "Medixcamp HealthCare System",
//         address: process.env.APP_USER_EMAIL,
//       },
//       to,
//       subject,
//       text: message.replace(/<[^>]+>/g, ""), // fallback plain text
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//           ${message}
//         </div>
//       `,
//       attachments,
//     };

//     const info = await transporter.sendMail(mailOptions);

//     console.log(`📨 Email successfully sent to ${to}`);
//     console.log(`SMTP Response: ${info.response}`);

//     return info;
//   } catch (error: any) {
//     console.error("❌ Error sending email:", error.message);
//     throw new Error("Failed to send email. " + error.message);
//   }
// };




import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  message: string
) => {
  try {
    if (!process.env.APP_USER_EMAIL || !process.env.APP_PASSWORD) {
      throw new Error("Email credentials missing in environment variables.");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.APP_USER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const now = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
      hour12: true,
    });

    const mailOptions = {
      from: `"Medixcamp HealthCare System" <${process.env.APP_USER_EMAIL}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Email Details</h2>
          <p><strong>From:</strong> Medixcamp HealthCare System &lt;${process.env.APP_USER_EMAIL}&gt;</p>
          <p><strong>To:</strong> ${to}</p>
          <p><strong>Date:</strong> ${now}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Mailed-By:</strong><a href="https://gmail.com">gmail.com</a></p>
          <hr />
          <h3>Message</h3>
          <div>${message}</div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.response}`);
    return info;
  } catch (error: any) {
    console.error("❌ Error sending email:", error.message);
    throw new Error("Failed to send email. " + error.message);
  }
};
