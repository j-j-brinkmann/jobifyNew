import { readFile } from "fs/promises";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import JobModel from "./models/JobModel.js";
import UserModel from "./models/UserModel.js";

try {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await UserModel.findOne({ email: "tester@test.com" });
  const jsonJobs = JSON.parse(
    await readFile(new URL("./utils/mockData.json", import.meta.url))
  );

  const jobs = jsonJobs.map((job) => {
    return { ...job, createdBy: user._id };
  });
  await JobModel.deleteMany({ createdBy: user._id });
  await JobModel.create(jobs);
  console.log("db populated successfully");
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
