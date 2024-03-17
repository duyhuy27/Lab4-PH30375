import nodemailer from "nodemailer";
// Create a transporter object
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "dhuy.ftmobile@gmail.com",
    pass: "hbwtjtruxefmcmqo",
  },
});

export default transporter;
