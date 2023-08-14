import { Router } from "express";
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
  getAllUser,
} from "../controllers/userControllers.js";
import { validateUpdateUser } from "../middleware/validationMiddleware.js";
import {
  authorizePermissions,
  checkForDemoUser,
} from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
const router = Router();
router.get("/all", getAllUser);
router.get("/current-user", getCurrentUser);
router.get("/admin/app-stats", [
  authorizePermissions("admin"),
  getApplicationStats,
]);
router.patch("/update-user", checkForDemoUser, validateUpdateUser, updateUser);
export default router;
