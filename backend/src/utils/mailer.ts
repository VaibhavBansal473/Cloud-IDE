import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async (email: string, message: string) => {
  console.log("Sending email...");

  const info = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "OTP for Cloud IDE",
    text: message,
  });

  console.log("Email sent:", info.response);
};

export default sendMail;