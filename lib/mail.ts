import nodemailer from "nodemailer";
import { TwoFAEmailHtml } from "@/components/email/TwoFactorEmail";
import { VerificationEmailHtml } from "@/components/email/VerificationEmail";
import { PasswordResetEmailHtml } from "@/components/email/PasswordResetEmail";

const domain = process.env.NEXT_PUBLIC_APP_URL;

const from = process.env.EMAIL_USERNAME;

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
      from,
      to: email,
      subject: "Confirm your email",
      html: VerificationEmailHtml({
        href: confirmLink,
        buttonText: "Verify Email",
      }),
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
      from,
      to: email,
      subject: "2FA Code",
      html: TwoFAEmailHtml({
        code: token,
      }),
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
      from,
      to: email,
      subject: "Reset your password",
      html: PasswordResetEmailHtml({
        href: resetLink,
        buttonText: "Reset Password",
      }),
    });
  } catch (err) {
    console.log(err);
  }
};
