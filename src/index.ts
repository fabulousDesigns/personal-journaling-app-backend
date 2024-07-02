import express, { Express } from "express";
import dotenv from "dotenv";
import { setupSwagger } from "./routes/swagger";
import rootRoute from "./routes/rootRoute";
import logger from "./utils/logger";
import { AppDataSource } from "./data-source";
import authRoute from "./routes/authRoute";
import protectedRoutes from "./routes/protectedRoutes";
import journalEntryRoutes from "./routes/journalEntry.routes";
import dataSummaryRoutes from "./routes/dataSummaryRoutes";
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5001;
AppDataSource.initialize()
  .then(() => {
    logger.info("Data Source has been initialized!");
    app.use(express.json());
    setupSwagger(app);
    app.use("/", rootRoute);
    app.use("/auth", authRoute);
    app.use("/api/journal-entries", journalEntryRoutes);
    app.use("/api/protected", protectedRoutes);
    app.use("/api", dataSummaryRoutes);
    app.listen(port, () => {
      logger.info(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    logger.error("Error during Data Source initialization", err);
  });
