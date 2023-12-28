import nodemailer from "nodemailer";

const sendMail = (subject, message, targetEmail) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "bhavusha590@gmail.com",
      pass: "nrsrmlmnknzzzjwb",
    },
  });

  var mailOptions = {
    from: "bhavusha590@gmail.com",
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
