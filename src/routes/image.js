import express from "express";
import downloadImage from "../controllers/image.js";

const router = express.Router();

router.get("/download/:filename", downloadImage);

export default router;
