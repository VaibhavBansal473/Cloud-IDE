import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async (email: string, message: string) => {
  console.log("Verifying SMTP connection...");

  await transporter.verify();

  console.log("SMTP verified.");

  const info = await transporter.sendMail({
    from: process.env.MAIL,
    to: email,
    subject: "OTP for Cloud IDE",
    text: message,
  });

  console.log("Email sent:", info.response);
};

export default sendMail;