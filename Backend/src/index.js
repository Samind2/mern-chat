import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRouter from "./routes/auth.router.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.BASE_URL,  // ใช้ process.env.BASE_URL แทนการใช้ string
    credentials: true
}));
app.get("/", (req, res) => {
  res.send("h1>Restfull Service for Mern chat Project</h1>");
});

app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log("Server is running on port HTTP://localhost:" + PORT);
  connectDB();
});


