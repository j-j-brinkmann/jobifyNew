import { Router } from "express";
const router = Router();

import {
  createJob,
  getAllJobs,
  getSingleJob,
  deleteJob,
  editJob,
  showStats,
} from "../controllers/jobControllers.js";
import {
  validateIdParam,
  validateJobInput,
} from "../middleware/validationMiddleware.js";
import { checkForDemoUser } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(getAllJobs)
  .post(checkForDemoUser, validateJobInput, createJob);
router.route("/stats").get(showStats);
router
  .route("/:id")
  .get(validateIdParam, getSingleJob)
  .patch(checkForDemoUser, validateIdParam, editJob)
  // .patch(validateIdParam, validateJobInput, editJob)
  .delete(checkForDemoUser, validateIdParam, deleteJob);

export default router;
