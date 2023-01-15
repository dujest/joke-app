import { createTransport, SendMailOptions } from "nodemailer";
import { User } from "../entity/user";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

async function sendEmail(mailOptions: SendMailOptions) {
  return new Promise((res, rej) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return rej(error);
      }
      return res(info);
    });
  });
}

export async function sendSignUpEmail(user: User, token: string) {
  const link = `${process.env.APP_URL}/verify?token=${token}`;
  const text = `The account has been successfully created. Click on this link to verify your account. ${link}`;
  const info = await sendEmail({
    to: user.email,
    subject: "Joke app account registration",
    text,
  });
  return info;
}
