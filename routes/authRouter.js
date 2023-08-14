import { Router } from "express";
const router = Router();
import {
  registerUser,
  getAllUser,
  loginUser,
  logoutUser,
} from "../controllers/authControllers.js";
import {
  validateLogin,
  validateRegistration,
} from "../middleware/validationMiddleware.js";

router.route("/").get(getAllUser);
router.route("/register").post(validateRegistration, registerUser);
router.route("/login").post(validateLogin, loginUser);
router.get("/logout", logoutUser);
export default router;
