import User from "../models/User.js";
import EmailToken from "../models/EmailToken.js";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

export const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists" });
    }

    const newUser = new User({
      email,
      password,
      verified: false,
    });

    await newUser.save();

    // Generate unique token for user
    const token = crypto.randomBytes(20).toString("hex");

    // Save token and user's email and password in database
    await new EmailToken({ token, email, password }).save();

    // Create confirmation URL
    const confirmationUrl = `${process.env.WEB_LINK}/confirm-email?token=${token}`;

    // Send email to user with confirmation URL
    await transporter.sendMail({
      from: "youremail@gmail.com",
      to: email,
      subject: "Please confirm your email",
      text: `Please click on this link to confirm your email: ${confirmationUrl}`,
    });

    res.status(201).json({ message: "Please confirm your email" });
  } catch (error) {
    console.error("Error creating new user:", error);
    res.status(500).json({ message: "Error creating new user" });
  }
};

export const confirmEmail = async (req, res) => {
  try {
    // Extract token from query parameters
    const { token } = req.query;

    // Look up user's email and password using token
    const emailToken = await EmailToken.findOne({ token });
    if (!emailToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    await User.findOneAndUpdate(
      { email: emailToken.email },
      { verified: true }
    );

    await EmailToken.deleteOne({ token });

    res.send("Your email has been confirmed!");
  } catch (error) {
    console.error("Error confirming email:", error);
    res.status(500).json({ message: "Error confirming email" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser || existingUser.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in user" });
  }
};
