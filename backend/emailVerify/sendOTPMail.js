// import nodemailer from "nodemailer";
// import "dotenv/config";

// export const sendOTPMail = async (otp, email) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_PASS,
//     },
//   });

//   const mailConfigurations = {
//     // It should be a string of sender/server email
//     from: process.env.MAIL_USER,

//     to: email,

//     // Subject of Email
//     subject: "Password reset otp",
//     html: `<p>Your OTP for you password is: <b>${otp}</b></p>`,

//     // This would be the text of email body
//     // text: `Hi! There, You have recently visited
//     //        our website and entered your email.
//     //        Please follow the given link to verify your email
//     //        http://localhost:5173/verify/${token}
//     //        Thanks`,
//   };

//   transporter.sendMail(mailConfigurations, function (error, info) {
//     if (error) throw Error(error);
//     console.log("OTP Sent Successfully");
//     console.log(info);
//   });
// };
// // Filename - tokenSender.js

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
