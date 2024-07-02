import express, { Express } from "express";
import dotenv from "dotenv";
import { setupSwagger } from "./routes/swagger";
import rootRoute from "./routes/rootRoute";
import logger from "./utils/logger";
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5001;
app.use(express.json());
setupSwagger(app);
app.use("/", rootRoute);
app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});
