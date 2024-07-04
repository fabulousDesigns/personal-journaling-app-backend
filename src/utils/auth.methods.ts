import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import bcrypt from "bcrypt";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const userRepository = AppDataSource.getRepository(User);
  return userRepository.findOne({ where: { email } });
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
