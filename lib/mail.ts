import nodemailer from "nodemailer";

const domain = process.env.NEXT_PUBLIC_APP_URL;

const transporter = nodemailer.createTransport({
  //@ts-ignore
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Confirm your email",
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendTwoFactorTokenEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "2FA Code",
      html: `<p>Your 2FA code: ${token}</p>`,
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendPasswordResetEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    });
  } catch (err) {
    console.log(err);
  }
};
