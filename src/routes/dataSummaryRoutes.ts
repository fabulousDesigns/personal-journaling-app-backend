import { Router, Request, Response } from "express";
import { getSummaryData } from "../services/dataSummaryService";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/summary:
 *   get:
 *     summary: Get summary data for a given period
 *     description: Fetch summary data for journal entries within the specified date range.
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEntries:
 *                   type: number
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get("/summary", authMiddleware, async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "startDate and endDate are required" });
  }

  try {
    const summaryData = await getSummaryData(
      startDate as string,
      endDate as string
    );
    res.json(summaryData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching summary data", error });
  }
});

export default router;
