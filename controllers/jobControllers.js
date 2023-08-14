import { StatusCodes } from "http-status-codes";
import JobModel from "../models/JobModel.js";
import { NotFoundError } from "../errors/customErrors.js";
import mongoose from "mongoose";
import dayjs from "dayjs";

const getAllJobs = async (req, res) => {
  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }
  if (jobStatus && jobStatus !== "all") {
    queryObject.jobStatus = jobStatus;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  // PAGINATION
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const allJobs = await JobModel.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);
  const jobCount = await JobModel.countDocuments(queryObject);
  const numOfPages = Math.ceil(jobCount / limit);
  res.json({ jobCount, numOfPages, currentPage: page, allJobs });
};

const getSingleJob = async (req, res) => {
  const { id } = req.params;
  const job = await JobModel.findById(id);

  if (!job) {
    throw new NotFoundError(`no job with id ${id} found`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await JobModel.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

const editJob = async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    return res.status(400).json({ msg: "please provide company and position" });
  }
  const { id } = req.params;
  const job = await JobModel.findByIdAndUpdate(
    id,
    {
      company,
      position,
    },
    { new: true } //das geänderte object wird zurückgegeben
  );

  if (!job) {
    throw new NotFoundError(`no job with id ${id} found`);
  }

  res.status(StatusCodes.OK).json({ msg: "job edited successfully" });
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  const job = await JobModel.findByIdAndDelete(id);
  if (!job) {
    throw new NotFoundError(`no job with id ${id} found`);
  }

  res.status(StatusCodes.OK).json({
    msg: `job deleted`,
  });
};

const showStats = async (req, res) => {
  let stats = await JobModel.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };
  let monthlyApplications = await JobModel.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = dayjs()
        .month(month - 1)
        .year(year)
        .format("MMM YY");

      return { date, count };
    })
    .reverse();
  // res.status(StatusCodes.OK).json(defaultStats);
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { getAllJobs, getSingleJob, createJob, editJob, deleteJob, showStats };
