import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs/promises";

const userRepository = AppDataSource.getRepository(User);

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { username, email, newPassword, name } = req.body;
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (name !== undefined) user.username = name;
    if (newPassword) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(newPassword, saltRounds);
    }

    await userRepository.save(user);

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.username,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const updateProfilePicture = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a unique filename
    const filename = `${userId}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    const uploadPath = path.join(__dirname, "../uploads", filename);

    // Move the file to a permanent location
    await fs.rename(file.path, uploadPath);

    // Update user's profile picture path
    user.profilePicture = `/uploads/${filename}`;
    await userRepository.save(user);

    res.json({
      message: "Profile picture updated successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error updating profile picture: ${error.message}` });
    } else {
      res.status(500).json({
        message: "An unknown error occurred while updating profile picture",
      });
    }
  }
};
