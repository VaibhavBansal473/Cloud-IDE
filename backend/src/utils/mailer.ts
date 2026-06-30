import nodemailer from "nodemailer";

console.log("A. Creating transporter");

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
  try {
    console.log("B. Inside sendMail");

    console.log("C. MAIL =", process.env.MAIL);
    console.log(
      "D. MAIL_PASS exists =",
      process.env.MAIL_PASS ? "YES" : "NO"
    );
    console.log("E. SENDER_EMAIL =", process.env.SENDER_EMAIL);

    console.log("F. Verifying SMTP...");
    await transporter.verify();
    console.log("G. SMTP verified");

    console.log("H. Sending email...");

    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "OTP for Cloud IDE",
      text: message,
    });

    console.log("I. Email sent:", info.response);
  } catch (err) {
    console.error("Mailer error:", err);
    throw err;
  }
};

export default sendMail;