import express, { Express } from "express";
import dotenv from "dotenv";
import { setupSwagger } from "./routes/swagger";
import rootRoute from "./routes/rootRoute";
import logger from "./utils/logger";
import { AppDataSource } from "./data-source";
import authRoute from "./routes/authRoute";
import journalEntryRoutes from "./routes/journalEntry.routes";
import dataSummaryRoutes from "./routes/dataSummaryRoutes";
import categoryRoute from "./routes/categoryRoute";
import profileRoutes from "./routes/profileRoutes";
import path from "path";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5001;
AppDataSource.initialize()
  .then(() => {
    logger.info("Data Source has been initialized!");
    app.use(express.json());
    setupSwagger(app);
    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      next();
    });
    app.use("/", rootRoute);
    app.use("/auth", authRoute);
    app.use("/api/categories", categoryRoute);
    app.use("/api/journal-entries", journalEntryRoutes);
    app.use("/api/", dataSummaryRoutes);
    app.use("/api", profileRoutes);
    app.listen(port, () => {
      logger.info(`Server is running at http://localhost:${port}`);
    });
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  })
  .catch((err) => {
    logger.error("Error during Data Source initialization", err);
  });
