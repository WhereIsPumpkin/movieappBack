// In app.js
import express from "express";
import connect from "./database/mongo.js";
import cors from "cors";
import {
  createUser,
  confirmEmail,
  loginUser,
  bookmarkMovie,
} from "./controllers/userController.js";
import { verifyToken } from "./controllers/tokenController.js";
import { authenticate } from "./middleware.js";
import dotenv from "dotenv";
import { getMovies } from "./controllers/movieController.js";
import multer from "multer";

dotenv.config();
connect();

const app = express();
app.use(express.json());

app.use(cors());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.post(
  "/register",
  multer({ storage: fileStorage, fileFilter }).single("avatar"),
  createUser
);
app.get("/confirm-email", confirmEmail);
app.post("/login", loginUser);
app.post("/verify", verifyToken);
app.get("/movies", getMovies);
app.put("/bookmark", authenticate, bookmarkMovie);

app.use("/", express.static("./public"));

app.listen(5555, () => {
  console.log(`Example app listening on port 5555`);
});
