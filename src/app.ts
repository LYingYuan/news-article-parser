import express, { Request, Response } from "express";
import { ParseRequestBody } from "../src/types";
import { isValidUrlArray } from "./utils/validation";
import { ValidationError } from "./utils/errors";

const app = express();

app.use(express.json());

app.post("/parse-news-articles", async (req: Request, res: Response) => {
  try {
    const body: ParseRequestBody = req.body;
    const urls = body.urls;

    if (!urls) {
      return res.status(400).send({ error: "URL is required" });
    } else if (!isValidUrlArray(urls)) {
      throw new ValidationError("Invalid URL format");
    }

    console.log("urls", urls);

    // TODO add a service to handle urls

    res.json({ message: "URLs received", data: urls });
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      console.error(`Validation error: ${error.message}`);
      res.status(400).send({ error: error.message });
    } else if (error instanceof Error) {
      console.error(`Error processing article: ${error.message}`);
      res.status(500).send({ error: error.message });
    } else {
      console.error(`An unexpected error occurred: ${error}`);
      res.status(500).send({ error: "An unexpected error occurred" });
    }
  } finally {
    res.end();
  }
});

export default app;
