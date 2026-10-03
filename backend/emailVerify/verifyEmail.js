import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = async (token, email) => {
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
    subject: "Verify your MeatLink account",

    html: `
      <h2>Welcome to MeatLink</h2>

      <p>Please click the link below to verify your email:</p>

      <a href="https://meat-link-sepia.vercel.app/verify/${token}">
  Verify Email
</a>

      <p>This verification link will expire in 10 minutes.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailConfigurations);

    console.log("Verification email sent successfully");
    console.log(info.messageId);
  } catch (error) {
    throw error;
  }
};
