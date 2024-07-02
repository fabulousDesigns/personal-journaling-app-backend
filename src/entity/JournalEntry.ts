import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Category } from "./Category";

@Entity("journal_entries")
export class JournalEntry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @Column("date")
  date: Date;

  @ManyToOne(() => User, (user) => user.journalEntries)
  user: User;

  @ManyToOne(() => Category, (category) => category.journalEntries)
  category: Category;

  constructor(
    title: string,
    content: string,
    date: Date,
    user: User,
    category: Category
  ) {
    this.title = title;
    this.content = content;
    this.date = date;
    this.user = user;
    this.category = category;
  }
}
