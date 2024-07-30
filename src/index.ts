import bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import conf from "./config";
import { logger, requestUriLoggerMiddlware } from "./utils/logger";
import { errorHandlingMiddleware } from "./middleware/errorHandlingMiddleware";

// import { webhookRoutes } from "./routes/webhook";
import privateUserRoutes from "./routes/user/private";
import publicUserRoutes from "./routes/user/public";
import privateGroupRoutes from "./routes/group/private";
import publicGroupRoutes from "./routes/group/public";
import privateExpenseRoutes from "./routes/expense/private";
import publicExpenseRoutes from "./routes/expense/public";
import privateTransactionRoutes from "./routes/transaction/private";
import publicTransactionRoutes from "./routes/transaction/public";

import { authenticateMiddleware } from "./middleware/auth";

dotenv.config();

const app: Express = express();
mongoose
  .connect(conf.MONGODB_URI)
  .then(() => logger("Database Connected"))
  .catch((err) => logger(err.message));

app.use(requestUriLoggerMiddlware);
app.use(
  cors({
    origin: conf.FRONTEND_ORIGIN || "*",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    methods: "GET,PUT,POST,DELETE,PATCH",
    credentials: true,
  })
);

// Webhook needs to be before parseing json middleware
// app.use("/api/webhook", webhookRoutes)

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Openbook API");
});

app.use("/api/public/user", publicUserRoutes);
app.use("/api/private/user", authenticateMiddleware, privateUserRoutes);
app.use("/api/public/group", publicGroupRoutes);
app.use("/api/private/group", authenticateMiddleware, privateGroupRoutes);
app.use("/api/public/expense", publicExpenseRoutes);
app.use("/api/private/expense", authenticateMiddleware, privateExpenseRoutes);
app.use("/api/public/transaction", publicTransactionRoutes);
app.use(
  "/api/private/transaction",
  authenticateMiddleware,
  privateTransactionRoutes
);

app.use(errorHandlingMiddleware);

app.listen(conf.PORT, () => {
  return console.log(`Express is listening at http://localhost:${conf.PORT}`);
});
