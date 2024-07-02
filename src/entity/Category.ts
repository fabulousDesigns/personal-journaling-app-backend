import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { JournalEntry } from "./JournalEntry";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => JournalEntry, (journalEntry) => journalEntry.category)
  journalEntries!: JournalEntry[];

  constructor(name: string) {
    this.name = name;
  }
}
