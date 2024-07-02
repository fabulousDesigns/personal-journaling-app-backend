import { createConnection, getRepository, Connection } from "typeorm";
import { Category } from "../src/entity/Category";
import ormConfig from "../ormconfig.test.json";

describe("Category Entity", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection(ormConfig as any);
  });

  afterAll(async () => {
    await connection.close();
  });
  //filr

  beforeEach(async () => {
    await connection.synchronize(true);
  });

  it("should create a new category", async () => {
    const categoryRepository = getRepository(Category);
    const category = new Category("Test Category");
    await categoryRepository.save(category);

    const savedCategory = await categoryRepository.findOne({
      where: { name: "Test Category" },
    });
    expect(savedCategory).toBeDefined();
    expect(savedCategory?.name).toBe("Test Category");
  });

  it("should not allow duplicate category names", async () => {
    const categoryRepository = getRepository(Category);
    const category1 = new Category("Unique Category");
    await categoryRepository.save(category1);

    const category2 = new Category("Unique Category");
    await expect(categoryRepository.save(category2)).rejects.toThrow();
  });

  it("should update an existing category", async () => {
    const categoryRepository = getRepository(Category);
    const category = new Category("Original Name");
    await categoryRepository.save(category);

    category.name = "Updated Name";
    await categoryRepository.save(category);

    const updatedCategory = await categoryRepository.findOne({
      where: { id: category.id },
    });
    expect(updatedCategory).toBeDefined();
    expect(updatedCategory?.name).toBe("Updated Name");
  });

  it("should delete a category", async () => {
    const categoryRepository = getRepository(Category);
    const category = new Category("To Be Deleted");
    await categoryRepository.save(category);

    await categoryRepository.remove(category);

    const deletedCategory = await categoryRepository.findOne({
      where: { id: category.id },
    });
    expect(deletedCategory).toBeNull();
  });
});
