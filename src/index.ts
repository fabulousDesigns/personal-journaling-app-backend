import express, { Express } from "express";
import dotenv from "dotenv";
import { setupSwagger } from "./routes/swagger";
import rootRoute from "./routes/rootRoute";
import logger from "./utils/logger";
import { AppDataSource } from "./data-source";
import authRoute from "./routes/authRoute";
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
    app.listen(port, () => {
      logger.info(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    logger.error("Error during Data Source initialization", err);
  });
