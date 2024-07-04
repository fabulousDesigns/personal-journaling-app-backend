import { AuthRequest } from "../middleware/authMiddleware";
import { AppDataSource } from "@/data-source";
import { JournalEntry } from "../entity/JournalEntry";
import { Response } from "express";
import {
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  format,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
} from "date-fns";

//! -> Daily Summary
export const getDailySummary = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.sendStatus(401); // Check if user is set

  const journalEntryRepository = AppDataSource.getRepository(JournalEntry);
  const today = new Date();
  const start = startOfDay(today);
  const end = endOfDay(today);

  const entries = await journalEntryRepository
    .createQueryBuilder("entry")
    .select("COUNT(entry.id)", "count")
    .addSelect("entry.date", "date")
    .where("entry.user.id = :userId", { userId: req.user.userId })
    .andWhere("entry.date >= :start", { start })
    .andWhere("entry.date <= :end", { end })
    .groupBy("entry.date")
    .getRawMany();

  const dailyData = eachDayOfInterval({ start, end }).map((date) => {
    const formattedDate = format(date, "EEE");
    const entry = entries.find(
      (e) => format(new Date(e.date), "EEE") === formattedDate
    );
    return {
      label: formattedDate,
      data: entry ? parseInt(entry.count, 10) : 0,
    };
  });

  res.json({
    daily: {
      labels: dailyData.map((d) => d.label),
      data: dailyData.map((d) => d.data),
    },
  });
};

//!-> Weekly Summary
export const getWeeklySummary = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.sendStatus(401); // Check if user is set

  const journalEntryRepository = AppDataSource.getRepository(JournalEntry);
  const today = new Date();
  const start = startOfWeek(today);
  const end = endOfWeek(today);

  const entries = await journalEntryRepository
    .createQueryBuilder("entry")
    .select("COUNT(entry.id)", "count")
    .addSelect("entry.date", "date")
    .where("entry.user.id = :userId", { userId: req.user.userId })
    .andWhere("entry.date >= :start", { start })
    .andWhere("entry.date <= :end", { end })
    .groupBy("entry.date")
    .getRawMany();

  const weeklyData = eachWeekOfInterval({ start, end }).map((date, index) => {
    const weekLabel = `Week ${index + 1}`;
    const entry = entries.find(
      (e) => format(new Date(e.date), "yyyy-ww") === format(date, "yyyy-ww")
    );
    return {
      label: weekLabel,
      data: entry ? parseInt(entry.count, 10) : 0,
    };
  });

  res.json({
    weekly: {
      labels: weeklyData.map((w) => w.label),
      data: weeklyData.map((w) => w.data),
    },
  });
};

//!-> Monthly Summary
export const getMonthlySummary = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.sendStatus(401); // Check if user is set

  const journalEntryRepository = AppDataSource.getRepository(JournalEntry);
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);

  const entries = await journalEntryRepository
    .createQueryBuilder("entry")
    .select("COUNT(entry.id)", "count")
    .addSelect("entry.date", "date")
    .where("entry.user.id = :userId", { userId: req.user.userId })
    .andWhere("entry.date >= :start", { start })
    .andWhere("entry.date <= :end", { end })
    .groupBy("entry.date")
    .getRawMany();

  const monthlyData = eachMonthOfInterval({ start, end }).map((date) => {
    const monthLabel = format(date, "MMM");
    const entry = entries.find(
      (e) => format(new Date(e.date), "MMM") === monthLabel
    );
    return {
      label: monthLabel,
      data: entry ? parseInt(entry.count, 10) : 0,
    };
  });

  res.json({
    monthly: {
      labels: monthlyData.map((m) => m.label),
      data: monthlyData.map((m) => m.data),
    },
  });
};
