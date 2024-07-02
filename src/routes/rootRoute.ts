import { Router, Request, Response } from "express";
const router = Router();
/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     description: Returns a welcome message to the client.
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Express + TypeScript Server
 */
router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

export default router;
