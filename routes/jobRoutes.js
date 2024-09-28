import express from "express";
import {
  createJob,
  getJobs,
  getJobTitles,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js"; // Assuming you have authentication middleware

const router = express.Router();

router.post("/create", protect, createJob);
router.get("/", getJobs);
router.get("/titles", getJobTitles);

export default router;
