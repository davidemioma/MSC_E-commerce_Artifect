import nodemailer from "nodemailer";
import { TwoFAEmailHtml } from "@/components/email/TwoFactorEmail";
import { OrderUpdateEmailHtml } from "@/components/email/OrderUpdateEmail";
import { CancelOrderEmailHtml } from "@/components/email/CancelOrderEmail";
import { VerificationEmailHtml } from "@/components/email/VerificationEmail";
import { ReturnRequestEmailHtml } from "@/components/email/ReturnRequestEmail";
import { PasswordResetEmailHtml } from "@/components/email/PasswordResetEmail";
import { StoreCancelOrderEmailHtml } from "@/components/email/StoreCancelOrderEmail";
import { StoreVerificationEmailHtml } from "@/components/email/StoreVerificationEmail";
import { ConfirmationOrderEmailHtml } from "@/components/email/ConfirmationOrderEmail";
import { StoreConfirmationEmailHtml } from "@/components/email/StoreConfirmationEmail";
import { ReturnOrderEmailHtml } from "@/components/email/ReturnOrderEmail";
import { StoreReturnOrderEmailHtml } from "@/components/email/StoreReturnOrderEmail";

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

export const sendCancelOrderEmail = async ({
  email,
  username,
  orderId,
  orderDate,
  totalAmount,
}: {
  email: string;
  username: string;
  orderId: string;
  orderDate: string;
  totalAmount: string;
}) => {
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: `Confirmation of Your Order Cancellation - [#${orderId}]`,
      html: CancelOrderEmailHtml({
        username,
        orderId,
        orderDate,
        totalAmount,
      }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendStoreCancelOrderEmail = async ({
  email,
  storeName,
  orderId,
  orderDate,
  item,
}: {
  email: string;
  storeName: string;
  item: string;
  orderId: string;
  orderDate: string;
}) => {
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: `Notice of Order Cancellation - Order [#${orderId}]`,
      html: StoreCancelOrderEmailHtml({
        storeName,
        orderId,
        orderDate,
        item,
      }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendOrderStatusUpdateEmail = async ({
  email,
  username,
  orderId,
  orderDate,
  orderStatus,
  address,
  totalAmount,
}: {
  email: string;
  username: string;
  address: string;
  orderId: string;
  orderDate: string;
  orderStatus: string;
  totalAmount: string;
}) => {
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: `Your Order  - Order [#${orderId}] is ${orderStatus}!`,
      html: OrderUpdateEmailHtml({
        username,
        orderId,
        orderDate,
        orderStatus,
        address,
        totalAmount,
      }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendReturnRequestEmail = async ({
  email,
  username,
  orderId,
  orderDate,
  items,
}: {
  email: string;
  username: string;
  orderId: string;
  orderDate: string;
  items: string;
}) => {
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: `Your Return Request for Order - [#${orderId}] - Received`,
      html: ReturnRequestEmailHtml({
        username,
        orderId,
        orderDate,
        items,
      }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendReturnOrderEmail = async ({
  email,
  username,
  orderId,
  orderDate,
  totalAmount,
}: {
  email: string;
  username: string;
  orderId: string;
  orderDate: string;
  totalAmount: string;
}) => {
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: `Confirmation of Your Order return - [#${orderId}]`,
      html: ReturnOrderEmailHtml({
        username,
        orderId,
        orderDate,
        totalAmount,
      }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendStoreReturnOrderEmail = async ({
  email,
  storeName,
  orderId,
  orderDate,
  item,
  reason,
}: {
  email: string;
  storeName: string;
  item: string;
  orderId: string;
  orderDate: string;
  reason: string;
}) => {
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: `Notification of Item Return - Order [#${orderId}]`,
      html: StoreReturnOrderEmailHtml({
        storeName,
        orderId,
        orderDate,
        item,
        reason,
      }),
    });
  } catch (err) {
    console.log(err);
  }
};
