import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import morgan from "morgan";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

// routers
import jobsRouter from "./routes/jobsRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

// public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.use(express.static(path.resolve(__dirname, "./public")));

  app.use(express.json());
  app.use(cookieParser());

  // routes
  app.use("/api/v1/jobs", authenticateUser, jobsRouter);
  app.use("/api/v1/users", authenticateUser, userRouter);
  app.use("/api/v1/auth", authRouter);

  // public folder
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./public", "index.html"));
  });

  app.use("*", (req, res) => {
    res.status(404).json({ msg: "route not found" });
  });

  app.use(errorHandlerMiddleware);

  const port = 5000 || process.env.PORT;

  // CONNECT TO DB AND START SERVER
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
