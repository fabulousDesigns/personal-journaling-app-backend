import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  token!: string;

  @Column()
  expiryDate!: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user!: User;
}
