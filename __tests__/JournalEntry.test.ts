import { createConnection, getRepository, Connection } from "typeorm";
import { JournalEntry } from "../src/entity/JournalEntry";
import { User } from "../src/entity/User";
import { Category } from "../src/entity/Category";
import ormConfig from "../ormconfig.test.json";

describe("JournalEntry Entity", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection(ormConfig as any);
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.synchronize(true);
  });

  it("should create a new journal entry", async () => {
    const userRepository = getRepository(User);
    const categoryRepository = getRepository(Category);
    const journalEntryRepository = getRepository(JournalEntry);

    const user = new User("testuser", "password123", "test@example.com");
    await userRepository.save(user);

    const category = new Category("Test Category");
    await categoryRepository.save(category);

    const journalEntry = new JournalEntry(
      "Test Entry",
      "This is a test entry",
      new Date(),
      user,
      category
    );
    await journalEntryRepository.save(journalEntry);

    const savedEntry = await journalEntryRepository.findOne({
      where: { title: "Test Entry" },
      relations: ["user", "category"],
    });

    expect(savedEntry).toBeDefined();
    expect(savedEntry?.title).toBe("Test Entry");
    expect(savedEntry?.content).toBe("This is a test entry");
    expect(savedEntry?.user.username).toBe("testuser");
    expect(savedEntry?.category.name).toBe("Test Category");
  });

  it("should update an existing journal entry", async () => {
    const userRepository = getRepository(User);
    const categoryRepository = getRepository(Category);
    const journalEntryRepository = getRepository(JournalEntry);

    const user = new User("testuser", "password123", "test@example.com");
    await userRepository.save(user);

    const category = new Category("Test Category");
    await categoryRepository.save(category);

    const journalEntry = new JournalEntry(
      "Original Title",
      "Original content",
      new Date(),
      user,
      category
    );
    await journalEntryRepository.save(journalEntry);

    journalEntry.title = "Updated Title";
    journalEntry.content = "Updated content";
    await journalEntryRepository.save(journalEntry);

    const updatedEntry = await journalEntryRepository.findOne({
      where: { id: journalEntry.id },
      relations: ["user", "category"],
    });

    expect(updatedEntry).toBeDefined();
    expect(updatedEntry?.title).toBe("Updated Title");
    expect(updatedEntry?.content).toBe("Updated content");
  });

  it("should delete a journal entry", async () => {
    const userRepository = getRepository(User);
    const categoryRepository = getRepository(Category);
    const journalEntryRepository = getRepository(JournalEntry);

    const user = new User("testuser", "password123", "test@example.com");
    await userRepository.save(user);

    const category = new Category("Test Category");
    await categoryRepository.save(category);

    const journalEntry = new JournalEntry(
      "To Be Deleted",
      "This entry will be deleted",
      new Date(),
      user,
      category
    );
    await journalEntryRepository.save(journalEntry);

    await journalEntryRepository.remove(journalEntry);

    const deletedEntry = await journalEntryRepository.findOne({
      where: { id: journalEntry.id },
    });

    expect(deletedEntry).toBeNull();
  });
});
