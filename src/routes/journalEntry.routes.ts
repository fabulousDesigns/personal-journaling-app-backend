import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { JournalEntry } from "../entity/JournalEntry";
import { Category } from "../entity/Category";
import { authMiddleware } from "../middleware/authMiddleware";
import { User } from "../entity/User";

const router = Router();

/**
 * @swagger
 * /api/journal-entries:
 *   post:
 *     summary: Create a new journal entry
 *     tags: [Journal Entries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - date
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               categoryId:
 *                 type: number
 *     responses:
 *       201:
 *         description: Journal entry created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { title, content, date, categoryId } = req.body;
  const userId = (req as any).user.userId;

  try {
    const user = await AppDataSource.getRepository(User).findOneBy({
      id: userId,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const category = await AppDataSource.getRepository(Category).findOneBy({
      id: categoryId,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const journalEntry = new JournalEntry(
      title,
      content,
      new Date(date),
      user,
      category
    );
    await AppDataSource.getRepository(JournalEntry).save(journalEntry);
    res.status(201).json(journalEntry);
  } catch (error) {
    res.status(500).json({ message: "Error creating journal entry", error });
  }
});

/**
 * @swagger
 * /api/journal-entries:
 *   get:
 *     summary: Get all journal entries
 *     tags: [Journal Entries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of journal entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JournalEntry'
 */
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const journalEntries = await AppDataSource.getRepository(JournalEntry).find(
      {
        where: { user: { id: userId } },
        relations: ["category"],
      }
    );
    res.json(journalEntries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching journal entries", error });
  }
});

/**
 * @swagger
 * /api/journal-entries/{id}:
 *   get:
 *     summary: Get a journal entry by ID
 *     tags: [Journal Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The journal entry ID
 *     responses:
 *       200:
 *         description: Journal entry data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalEntry'
 *       404:
 *         description: Journal entry not found
 */
router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const journalEntry = await AppDataSource.getRepository(
      JournalEntry
    ).findOne({
      where: { id: parseInt(id), user: { id: userId } },
      relations: ["category"],
    });

    if (!journalEntry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }

    res.json(journalEntry);
  } catch (error) {
    res.status(500).json({ message: "Error fetching journal entry", error });
  }
});

/**
 * @swagger
 * /api/journal-entries/{id}:
 *   put:
 *     summary: Update a journal entry by ID
 *     tags: [Journal Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The journal entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               categoryId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Journal entry updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Journal entry not found
 */
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, date, categoryId } = req.body;
  const userId = (req as any).user.userId;

  try {
    const journalEntry = await AppDataSource.getRepository(
      JournalEntry
    ).findOne({
      where: { id: parseInt(id), user: { id: userId } },
    });

    if (!journalEntry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }

    const category = await AppDataSource.getRepository(Category).findOneBy({
      id: categoryId,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    journalEntry.title = title;
    journalEntry.content = content;
    journalEntry.date = new Date(date);
    journalEntry.category = category;

    await AppDataSource.getRepository(JournalEntry).save(journalEntry);
    res.json(journalEntry);
  } catch (error) {
    res.status(500).json({ message: "Error updating journal entry", error });
  }
});

/**
 * @swagger
 * /api/journal-entries/{id}:
 *   delete:
 *     summary: Delete a journal entry by ID
 *     tags: [Journal Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The journal entry ID
 *     responses:
 *       200:
 *         description: Journal entry deleted successfully
 *       404:
 *         description: Journal entry not found
 */
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.userId;

  try {
    const journalEntry = await AppDataSource.getRepository(
      JournalEntry
    ).findOne({
      where: { id: parseInt(id), user: { id: userId } },
    });

    if (!journalEntry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }

    await AppDataSource.getRepository(JournalEntry).remove(journalEntry);
    res.json({ message: "Journal entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting journal entry", error });
  }
});

export default router;
