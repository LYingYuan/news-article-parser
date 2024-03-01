import { isValidUrlArray } from "../utils/validation.js";
import parseArticles from "../services/news.js";

async function parseNewsArticles(req, res) {
  try {
    const body = req.body;
    const urls = body.urls;
    const llmApiConfig = body.llmApiConfig;

    if (!urls) {
      return res.status(400).send({ error: "URL is required" });
    } else if (!isValidUrlArray(urls)) {
      throw new Error(`Invalid URL format: \n${urls.join("\n")}`);
    }

    const data = await parseArticles(urls, llmApiConfig);
    res.status(200).send(data);
  } catch (error) {
    console.error(`Error processing article: ${error.message}`);
    res.status(500).send({ error: error.message });
  } finally {
    res.end();
  }
}

export default parseNewsArticles;
