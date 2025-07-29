import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "../src/middleware/errorHandler.middleware.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//import rotuers
import userRouter from "./routes/user.routes.js";
import summaryRouter from "./routes/summary.routes.js";
import summarizerRoute from "./routes/summarizer.js";
import qaRouter from "./routes/qa.routes.js";

app.use("/api/v1/summarizer", summarizerRoute);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/summary", summaryRouter);
app.use("/api/v1/qa", qaRouter);

app.use(errorHandler);
export default app;
