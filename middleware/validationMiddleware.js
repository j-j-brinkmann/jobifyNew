import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import mongoose from "mongoose";
import JobModel from "../models/JobModel.js";
import UserModel from "../models/UserModel.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => " " + error.msg);

        const firstMessage = errorMessages[0];
        console.log(Object.getPrototypeOf(firstMessage));
        if (errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("not authorized")) {
          throw new UnauthorizedError("not authorized to access this route");
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  body("company").notEmpty().withMessage("company name must be provided"),
  body("position").notEmpty().withMessage("position must be provided"),
  body("jobLocation")
    .notEmpty()
    .withMessage("job location name must be provided"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid job status value"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("invalid job type value"),
]);

export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError("invalid MongoDB id");
    const job = await JobModel.findById(value);
    if (!job) throw new NotFoundError(`no job with id ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === job.createdBy.toString();

    if (!isAdmin && !isOwner)
      throw new UnauthorizedError("not authorized to access this route");
  }),
]);

export const validateRegistration = withValidationErrors([
  body("name").notEmpty().withMessage("please provide a name"),
  body("email")
    .notEmpty()
    .withMessage("please provide a email")
    .isEmail()
    .withMessage("email invalid! please check your input")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (user) {
        throw new BadRequestError("email is already registered");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("please provide a password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
  body("location").notEmpty().withMessage("please provide a location"),
  body("lastName").notEmpty().withMessage("please provide a last name"),
]);

export const validateLogin = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("please provide a email")
    .isEmail()
    .withMessage("email invalid! please check your input"),
  body("password").notEmpty().withMessage("please provide a password"),
]);

export const validateUpdateUser = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email, { req }) => {
      const user = await UserModel.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new BadRequestError("email already exists");
      }
    }),

  body("location").notEmpty().withMessage("location is required"),
  body("lastName").notEmpty().withMessage("last name is required"),
]);
