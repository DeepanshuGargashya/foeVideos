import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import config from "./config.js";
const oauth2Client = new OAuth2Client(
  config.clientId,
  config.clientSecret,
  config.redirectUri
);

oauth2Client.setCredentials({
  refresh_token: config.refreshToken,
});

const sendMail = async (subject, message, targetEmail) => {
  console.log("token generating");
  const accessToken = await oauth2Client.getAccessToken();
  console.log("token generated");
  var transporter = nodemailer.createTransport({
    // service: "gmail",
    // host: "smtp.gmail.com",
    // port: 465,
    // secure: true,
    // auth: {
    //   user: "bhavusha590@gmail.com",
    //   pass: "qesmjqvbryyvvztp",
    // },
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "foevideosinfo@gmail.com",
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      refreshToken: config.refreshToken,
      accessToken,
    },
  });

  var mailOptions = {
    from: "foevideosinfo@gmail.com",
    to: targetEmail,
    subject: subject,

    html:
      "<p>Your foeVideo <b>email verify OTP</b> is : </p>" +
      "<b>" +
      message +
      "</b>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default sendMail;
