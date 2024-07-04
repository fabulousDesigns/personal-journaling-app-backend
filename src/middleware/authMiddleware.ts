import { User } from "@/entity/User";
import { createRefreshToken } from "@/services/refreshTokenService";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "secret";
const ACCESS_TOKEN_EXPIRY = "15m";

interface AuthRequest extends Request {
  user?: { userId: number };
}

export const generateTokens = async (user: User) => {
  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = await createRefreshToken(user);
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): { userId: number } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded;
  } catch (error) {
    return null;
  }
};

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  const decoded = verifyAccessToken(token);
  if (!decoded) return res.sendStatus(403);

  req.user = decoded;
  next();
};
