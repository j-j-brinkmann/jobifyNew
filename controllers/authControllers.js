import UserModel from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { comparePasswords, hashPassword } from "../utils/passwordUtils.js";
import {
  UnAuthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";

const registerUser = async (req, res) => {
  const isFirstAccount = (await UserModel.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";

  // encrypt the password
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  const user = await UserModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ user });
};

const getAllUser = async (req, res) => {
  const allUser = await UserModel.find({});
  const noPasswords = allUser.map((user) => {
    console.log(user);
  });
  res.status(StatusCodes.OK).json({ noPasswords });
};

const loginUser = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });

  const isValidUser =
    user && (await comparePasswords(req.body.password, user.password));
  if (!isValidUser)
    throw new UnAuthenticatedError("email / password is incorrect");

  const token = createJWT({ userId: user._id, role: user.role });

  const oneDay = 1000 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });
  res.status(StatusCodes.OK).json({ msg: "logged in" });
};

const logoutUser = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "logged out." });
};

export { registerUser, getAllUser, loginUser, logoutUser };
