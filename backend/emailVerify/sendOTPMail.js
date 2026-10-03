import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (otp, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailConfigurations = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Password reset OTP",
    html: `<p>Your OTP for your password reset is: <b>${otp}</b></p>`,
  };

  try {
    const info = await transporter.sendMail(mailConfigurations);

    console.log("OTP Sent Successfully");
    console.log(info.messageId);
  } catch (error) {
    throw error;
  }
};
