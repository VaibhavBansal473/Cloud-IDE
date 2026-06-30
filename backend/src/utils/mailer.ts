import axios from "axios";

const sendMail = async (email: string, message: string) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Cloud IDE",
          email: process.env.SENDER_EMAIL,
        },
        to: [
          {
            email,
          },
        ],
        subject: "OTP for Cloud IDE",
        textContent: message,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY as string,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent:", response.data);
  } catch (err: any) {
    console.error(
      "Brevo API error:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export default sendMail;