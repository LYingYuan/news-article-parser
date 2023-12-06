import express from "express";
import newsRoutes from "./routes/news.js";

const app = express();

app.use(express.json());

app.use("/api", newsRoutes);

export default app;
