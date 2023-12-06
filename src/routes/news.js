import express from "express";
import parseNewsArticles from "../controllers/news.js";

const router = express.Router();

router.post("/parse-news-articles", parseNewsArticles);

export default router;
