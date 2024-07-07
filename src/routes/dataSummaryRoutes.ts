import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getDailySummary,
  getMonthlySummary,
  getWeeklySummary,
} from "@/services/dataSummaryService";

const router = Router();

/**
 * @swagger
 * /api/summary/daily:
 *   get:
 *     summary: Get daily summary of journal entries
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 daily:
 *                   type: object
 *                   properties:
 *                     labels:
 *                       type: array
 *                       items:
 *                         type: string
 *                     data:
 *                       type: array
 *                       items:
 *                         type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/summary/daily", authMiddleware, getDailySummary);

/**
 * @swagger
 * /api/summary/weekly:
 *   get:
 *     summary: Get weekly summary of journal entries
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 weekly:
 *                   type: object
 *                   properties:
 *                     labels:
 *                       type: array
 *                       items:
 *                         type: string
 *                     data:
 *                       type: array
 *                       items:
 *                         type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/summary/weekly", authMiddleware, getWeeklySummary);

/**
 * @swagger
 * /api/summary/monthly:
 *   get:
 *     summary: Get monthly summary of journal entries
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 monthly:
 *                   type: object
 *                   properties:
 *                     labels:
 *                       type: array
 *                       items:
 *                         type: string
 *                     data:
 *                       type: array
 *                       items:
 *                         type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/summary/monthly", authMiddleware, getMonthlySummary);

export default router;
