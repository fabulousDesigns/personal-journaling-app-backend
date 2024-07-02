import { createConnection, getRepository, Connection } from "typeorm";
import { User } from "../src/entity/User";
import ormConfig from "../ormconfig.test.json";

describe("User Entity", () => {
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

  it("should create a new user", async () => {
    const userRepository = getRepository(User);
    const user = new User("testuser", "password123", "test@example.com");
    await userRepository.save(user);

    const savedUser = await userRepository.findOne({
      where: { username: "testuser" },
    });
    expect(savedUser).toBeDefined();
    expect(savedUser?.username).toBe("testuser");
    expect(savedUser?.email).toBe("test@example.com");
  });

  it("should not allow duplicate usernames", async () => {
    const userRepository = getRepository(User);
    const user1 = new User("uniqueuser", "password123", "user1@example.com");
    await userRepository.save(user1);

    const user2 = new User("uniqueuser", "password456", "user2@example.com");
    await expect(userRepository.save(user2)).rejects.toThrow();
  });
});
