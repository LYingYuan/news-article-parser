import { load } from "cheerio";
import { launch } from "puppeteer";
import { extractFromHtml } from "@extractus/article-extractor";

class Article {
  constructor(url) {
    this.url = url;
    this.title = "";
    this.content = "";
    this.source = "";
  }

  async handleArticle() {
    try {
      const url = this.url;

      console.log(`========Handling url========`);
      console.log(`${url}`);

      const HTMLContent = await this.getHTMLContent(url);
      await this.parseArticle(HTMLContent);
      const newsArticle = this.concatInfo();

      return newsArticle;
    } catch (error) {
      console.error(`Error processing article: ${error.message}`);
      throw error;
    }
  }

  async getHTMLContent(url) {
    try {
      // Execute this code within a new headless browser instance
      const browser = await launch({ headless: "new", executablePath: "/usr/bin/chromium", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
      const page = await browser.newPage();
      await page.goto(url);

      // Get the full HTML content of the page
      const pageContent = await page.content();

      if (!pageContent || pageContent.trim() === "") {
        throw new Error("Retrieved HTML content is empty");
      }
      // Close the browser
      await browser.close();

      return pageContent;
    } catch (error) {
      console.error(`Error getting article: ${error.message}`);
      throw error;
    }
  }

  async parseArticle(pageContent) {
    try {
      // Get the article's content from the page
      const article = await extractFromHtml(pageContent);

      if (!article) {
        throw new Error("Article is null");
      }

      this.parseTitle(article);
      await this.parseContent(article, pageContent);
      this.parseSource(article, pageContent);
    } catch (error) {
      console.error(`Error parsing article's content: ${error}`);
      throw error;
    }
  }

  parseTitle(article) {
    try {
      console.log("Parsing title...");

      this.title = article.title || "";
    } catch (error) {
      console.error(`Error parsing article's title: ${error}`);
      throw error;
    }
  }

  async parseContent(article, pageContent) {
    try {
      console.log("Parsing content...");

      const $ = load(article.content || "");
      // const $content = $();

      // Rewrite <img>

      // Other rules...
      const content = "...";

      if (!content || content.trim() === "") {
        throw new Error("Content is empty");
      }

      this.content = content || "";
    } catch (error) {
      console.error(`Error parsing article's content: ${error}`);
      throw error;
    }
  }

  parseSource(article, pageContent) {
    try {
      console.log("Parsing source...");

      const $ = load(pageContent);

      const source = "";

      this.source = source || "";
    } catch (error) {
      console.error(`Error parsing article's source: ${error}`);
      throw error;
    }
  }

  concatInfo() {
    const source = this.source;
    const title = this.title;
    const content = `${this.content}<p>自 ${source}</p>`;

    const article = {
      title,
      content,
    };

    console.log(`============================\n`);

    return article;
  }
}

export default Article;
