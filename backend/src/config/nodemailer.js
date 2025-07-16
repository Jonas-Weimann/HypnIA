import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const config = {
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
};

export const transporter = createTransport(config);
