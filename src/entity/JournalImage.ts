import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { JournalEntry } from "./JournalEntry";

@Entity("journal_images")
export class JournalImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => JournalEntry, (journalEntry) => journalEntry.images)
  journalEntry: JournalEntry;

  constructor(imageUrl: string, journalEntry: JournalEntry) {
    this.imageUrl = imageUrl;
    this.journalEntry = journalEntry;
  }
}
