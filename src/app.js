import express from "express";
import newsRoutes from "./routes/news.js";
import imageRoutes from "./routes/image.js";

const app = express();

app.use(express.json());

app.use("/api", newsRoutes);
app.use("/", imageRoutes);

export default app;
