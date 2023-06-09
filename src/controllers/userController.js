import User from "../models/User.js";
import EmailToken from "../models/EmailToken.js";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import multer from "multer";

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
    const file = req.file;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists" });
    }

    let avatarPath = file.path.replace(/^public[\\/]/, "");

    avatarPath = "/" + avatarPath.replace(/\\/g, "/");

    const newUser = new User({
      email,
      password,
      verified: false,
      id: uuidv4(),
      avatar: avatarPath,
    });

    await newUser.save();

    // Generate unique token for user
    const token = crypto.randomBytes(20).toString("hex");

    // Save token and user's email and password in database
    await new EmailToken({ token, email, verified: false }).save();

    // Create confirmation URL
    const confirmationUrl = `${process.env.WEB_LINK}/confirm-email?token=${token}`;

    // Send email to user with confirmation URL
    await transporter.sendMail({
      from: "youremail@gmail.com",
      to: email,
      subject: "Please confirm your email",
      html: `
        <div style="font-family: sans-serif;">
          <h1 style="font-size: 18px;">Please confirm your email</h1>
          <p style="font-size: 16px;">
            Thank you for signing up! Please click on the link below to confirm your email and activate your account:
          </p>
          <a href="${confirmationUrl}" style="font-size: 16px; color: blue;">Confirm Email</a>
        </div>
      `,
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

    res.send(`
      <div style="font-family: sans-serif;">
        <h1 style="font-size: 18px;">Your email has been confirmed!</h1>
        <p style="font-size: 16px;">
          Thank you for verifying your email. Your account is now activated and you can log in to access all features.
        </p>
      </div>
    `);
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

    // Create a JWT for the user
    const token = jwt.sign(
      {
        email: existingUser.email,
        avatar: existingUser.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in user" });
  }
};

export const bookmarkMovie = async (req, res) => {
  try {
    const { movieId } = req.body;
    const currentUser = await User.findOne({ email: req.user.email });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let newBookmarks;
    if (currentUser.bookmarks.includes(movieId)) {
      // Remove movieId from bookmarks
      newBookmarks = currentUser.bookmarks.filter((id) => id !== movieId);
    } else {
      // Add movieId to bookmarks
      newBookmarks = [...currentUser.bookmarks, movieId];
    }

    await User.findOneAndUpdate(
      { email: req.user.email },
      { bookmarks: newBookmarks }
    );

    res.status(200).json({ message: "Bookmarks updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
