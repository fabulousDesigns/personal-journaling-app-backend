import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const JWT_SECRET: string = process.env.JWT_SECRET || "secret";
// ! -> Generate token function
const generate_token = (userId: number): string => {
  try {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
};
// ! -> Hash password function
const hash_password = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
};
// ! -> Register function
export const register = async (
  username: string,
  email: string,
  password: string
): Promise<User> => {
  try {
    const hashed_password = await hash_password(password);
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create({
      username,
      email,
      password: hashed_password,
    });
    await userRepository.save(user);
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("Failed to register user");
  }
};
// ! -> Login function
export const login = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }
    const is_valid = await bcrypt.compare(password, user.password);
    if (!is_valid) {
      throw new Error("Invalid password");
    }
    return generate_token(user.id);
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Failed to log in");
  }
};
