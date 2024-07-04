import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getDailySummary,
  getMonthlySummary,
  getWeeklySummary,
} from "@/services/dataSummaryService";

const router = Router();

router.get("/summary/daily", authMiddleware, getDailySummary);
router.get("/summary/weekly", authMiddleware, getWeeklySummary);
router.get("/summary/monthly", authMiddleware, getMonthlySummary);

export default router;
