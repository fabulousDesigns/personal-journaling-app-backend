import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Category } from "./entity/Category";
import { JournalEntry } from "./entity/JournalEntry";
import { RefreshToken } from "./entity/RefreshToken";
import { JournalImage } from "./entity/JournalImage";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "12345678",
  database: "journal",
  synchronize: true,
  logging: false,
  entities: [User, Category, JournalEntry, RefreshToken, JournalImage],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});
