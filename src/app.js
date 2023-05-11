import express from "express";
import connect from "./database/mongo.js";
import cors from "cors";
import { createUser } from "./controllers/userController.js";
import dotenv from "dotenv";

dotenv.config();
connect();

const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", createUser);

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
