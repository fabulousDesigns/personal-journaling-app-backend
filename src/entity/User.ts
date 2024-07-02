import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { JournalEntry } from "./JournalEntry";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => JournalEntry, (journalEntry) => journalEntry.user)
  journalEntries!: JournalEntry[];

  constructor(username: string, password: string, email: string) {
    this.username = username;
    this.password = password;
    this.email = email;
  }
}
