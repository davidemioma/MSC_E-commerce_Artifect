import nodemailer from "nodemailer";
import { TwoFAEmailHtml } from "@/components/email/TwoFactorEmail";
import { VerificationEmailHtml } from "@/components/email/VerificationEmail";
import { PasswordResetEmailHtml } from "@/components/email/PasswordResetEmail";
import { StoreVerificationEmailHtml } from "@/components/email/StoreVerificationEmail";
import { ConfirmationOrderEmailHtml } from "@/components/email/ConfirmationOrderEmail";
import { StoreConfirmationEmailHtml } from "@/components/email/StoreConfirmationEmail";

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

export const sendStoreVerificationTokenEmail = async ({
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
      subject: "Store Verification Code",
      html: StoreVerificationEmailHtml({
        code: token,
      }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendConfirmationOrderEmail = async ({
  email,
  username,
  address,
  totalAmount,
}: {
  email: string;
  username: string;
  address: string;
  totalAmount: string;
}) => {
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "Your Order Confirmation",
      html: ConfirmationOrderEmailHtml({
        username,
        address,
        totalAmount,
      }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendStoreConfirmationEmail = async ({
  email,
  storeName,
  customerName,
  orderDate,
  items,
}: {
  email: string;
  storeName: string;
  customerName: string;
  orderDate: string;
  items: string;
}) => {
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "New Order Alert",
      html: StoreConfirmationEmailHtml({
        storeName,
        customerName,
        orderDate,
        items,
      }),
    });
  } catch (err) {
    console.log(err);
  }
};
