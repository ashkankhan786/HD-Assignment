import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { CustomRequest } from "../middlewares/auth";
import { OAuth2Client } from "google-auth-library";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (req: Request, res: Response) => {
  const { name, dob, email } = req.body;
  const otp = generateOTP();

  let user = await User.findOne({ email });

  if (!user) {
    if (!name || !dob) {
      return res
        .status(400)
        .json({ error: "Name and DOB required for registration" });
    }

    user = await User.create({ email, name, dob, otp });
  } else {
    user.otp = otp;
    await user.save();
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Your OTP Code for Note App",
    text: `Your OTP is ${otp}`,
  });

  res.json({ message: "OTP sent successfully" });
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp, keepMeLoggedIn } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp) {
    return res.status(401).json({ error: "Invalid OTP" });
  }

  user.otp = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: keepMeLoggedIn ? "30d" : "1h",
  });
  res.json({ token, user });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload)
      return res.status(400).json({ error: "Invalid Google token" });

    const { email, name, sub: googleId } = payload;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, googleId });
    }

    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    res.json({
      token: authToken,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(401).json({ error: "Google login failed" });
  }
};

export const getUserProfile = async (req: CustomRequest, res: Response) => {
  const user = await User.findById(req.userId).select("name email");

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ name: user.name, email: user.email });
};
