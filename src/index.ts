import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import conf from "./config";
dotenv.config();

const app: Express = express();
const port = conf.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});