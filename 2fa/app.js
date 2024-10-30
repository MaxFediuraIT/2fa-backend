import "dotenv/config";
import express from "express";
import { userRouter } from "./routes/index.js";
import bodyParser from "body-parser";
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use("/api/user", userRouter);

export { app };
