import { AppDataSource } from "../data-source";
import { JournalEntry } from "../entity/JournalEntry";

export const getSummaryData = async (startDate: string, endDate: string) => {
  const journalEntryRepository = AppDataSource.getRepository(JournalEntry);

  // Fetch journal entries within the specified date range with user and category details
  const entries = await journalEntryRepository
    .createQueryBuilder("journalEntry")
    .leftJoinAndSelect("journalEntry.user", "user")
    .leftJoinAndSelect("journalEntry.category", "category")
    .where("journalEntry.date BETWEEN :startDate AND :endDate", {
      startDate,
      endDate,
    })
    .getMany();

  // Calculate total number of entries
  const totalEntries = entries.length;

  // Calculate total words count across all entries
  const totalWordsCount = entries.reduce(
    (total, entry) => total + entry.content.split(" ").length,
    0
  );

  // Count entries per category
  const categoryCounts: { [key: string]: number } = {}; // Define type for categoryCounts

  entries.forEach((entry) => {
    const categoryName = entry.category.name;
    categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
  });

  // Construct the summary object
  const summary = {
    totalEntries,
    totalWordsCount,
    categoryCounts,
  };

  return summary;
};
