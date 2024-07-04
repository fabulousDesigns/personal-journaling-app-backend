import { AppDataSource } from "../data-source";
import { JournalEntry } from "../entity/JournalEntry";
import { Category } from "../entity/Category";
import { User } from "../entity/User";
import { JournalImage } from "@/entity/JournalImage";

export class JournalEntryService {
  private journalEntryRepository = AppDataSource.getRepository(JournalEntry);
  private categoryRepository = AppDataSource.getRepository(Category);
  private userRepository = AppDataSource.getRepository(User);
  private journalImageRepository = AppDataSource.getRepository(JournalImage);

  async createJournalEntry(data: {
    title: string;
    content: string;
    date: string;
    categoryId: number;
    userId: number;
    images?: string[]; // Make images optional
  }): Promise<JournalEntry> {
    const { title, content, date, categoryId, userId, images } = data;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new Error("Category not found");
    }

    const journalEntry = new JournalEntry(
      title,
      content,
      new Date(date),
      user,
      category
    );

    const savedJournalEntry = await this.journalEntryRepository.save(
      journalEntry
    );

    if (images && images.length > 0) {
      for (const imageUrl of images) {
        const journalImage = new JournalImage(imageUrl, savedJournalEntry);
        await this.journalImageRepository.save(journalImage);
      }
    }

    const result = await this.journalEntryRepository.findOne({
      where: { id: savedJournalEntry.id },
      relations: ["images"],
    });

    if (!result) {
      throw new Error("Failed to fetch the created journal entry");
    }

    return result;
  }

  async getAllJournalEntries(userId: number): Promise<JournalEntry[]> {
    return this.journalEntryRepository.find({
      where: { user: { id: userId } },
      relations: ["category"],
    });
  }

  async getJournalEntryById(
    id: number,
    userId: number
  ): Promise<JournalEntry | null> {
    return this.journalEntryRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ["category"],
    });
  }

  async updateJournalEntry(
    id: number,
    userId: number,
    data: {
      title: string;
      content: string;
      date: string;
      categoryId: number;
    }
  ): Promise<JournalEntry> {
    const { title, content, date, categoryId } = data;

    const journalEntry = await this.journalEntryRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!journalEntry) {
      throw new Error("Journal entry not found");
    }

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new Error("Category not found");
    }

    journalEntry.title = title;
    journalEntry.content = content;
    journalEntry.date = new Date(date);
    journalEntry.category = category;

    return this.journalEntryRepository.save(journalEntry);
  }

  async deleteJournalEntry(id: number, userId: number): Promise<void> {
    const journalEntry = await this.journalEntryRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!journalEntry) {
      throw new Error("Journal entry not found");
    }

    await this.journalEntryRepository.remove(journalEntry);
  }
}
