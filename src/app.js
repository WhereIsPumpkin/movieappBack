// In app.js
import express from "express";
import connect from "./database/mongo.js";
import cors from "cors";
import {
  createUser,
  confirmEmail,
  loginUser,
} from "./controllers/userController.js";
import { verifyToken } from "./controllers/tokenController.js";
import { authenticate } from "./middleware.js";
import dotenv from "dotenv";
import { getMovies } from "./controllers/movieController.js";

dotenv.config();
connect();

const app = express();
app.use(express.json());

app.use(cors());

app.post("/register", createUser);
app.get("/confirm-email", confirmEmail);
app.post("/login", loginUser);
app.get("/verify", verifyToken);
app.get("/movies", getMovies);

app.use("/", express.static("./public"));

// app.get("/protected-route", authenticate, (req, res) => {
//   res.status(200).json({ message: "Successfully entered protected route" });
// });

app.listen(4444, () => {
  console.log(`Example app listening on port 4444`);
});
