import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = async (req, res) => {
  try {
    const { email, password, id } = req.body;
    const newUser = new User({ email, password, id: uuidv4() });
    await newUser.save();
    console.log("New user created:", newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating new user:", error);
    res.status(500).json({ message: "Error creating new user" });
  }
};
