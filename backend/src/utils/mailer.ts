import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async (email: string, message: string) => {
  const info = await transporter.sendMail({
    from: process.env.MAIL,
    to: email,
    subject: "OTP for Cloud IDE",
    text: message,
  });

  console.log("Email sent:", info.response);
};

export default sendMail;