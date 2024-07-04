import { AppDataSource } from "@/data-source";
import { RefreshToken } from "@/entity/RefreshToken";
import { User } from "@/entity/User";
import { v4 as uuidv4 } from "uuid";

export const createRefreshToken = async (user: User): Promise<string> => {
  const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now

  const refreshToken = refreshTokenRepository.create({
    user,
    token: uuidv4(),
    expiryDate,
  });

  await refreshTokenRepository.save(refreshToken);
  return refreshToken.token;
};

export const verifyRefreshToken = async (
  token: string
): Promise<User | null> => {
  const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
  const refreshToken = await refreshTokenRepository.findOne({
    where: { token },
    relations: ["user"],
  });

  if (!refreshToken || refreshToken.expiryDate < new Date()) {
    return null;
  }

  return refreshToken.user;
};

export const deleteRefreshToken = async (token: string): Promise<void> => {
  const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
  await refreshTokenRepository.delete({ token });
};
