import { load } from "cheerio";
import { launch } from "puppeteer";
import { extractFromHtml } from "@extractus/article-extractor";
import chatWithLargeLanguageModel from "./LLMService.js";

class Article {
  constructor(url, llmApiConfig) {
    this.url = url;
    this.title = "";
    this.content = "";
    this.source = "";
    this.summary = "";
    this.llmApiConfig = llmApiConfig;
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
      await this.summarizeArticle();
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

  async summarizeArticle() {
    try {
      if ((this.llmApiConfig = "")) {
        this.summary = "";
        return;
      }
      const prompt =
        "请你总结这篇文章，要求：1.字数严格控制在 100-120 字；2.重点利用文章中的数据，使其更有说服力；3.不要使用吸引眼球的夸张语法，理性叙事总结；4.如果有，请注明这篇文章的来源、研究团队等，并将其放置于摘要的开头；5.不要出现“这篇文章”等字眼；6.不要出现文章未提及的内容及数据。\n";
      const message = `${prompt}${this.content}`;
      const summary = await chatWithLargeLanguageModel(message, this.llmApiConfig);

      this.summary = summary || "";
    } catch (error) {
      console.error(`Error summarizing article: ${error}`);
      throw error;
    }
  }

  async categorizeArticle() {
    // TODO 正则表达式完成一部分
    const categoryMap = [
      {
        strings: ["Bloomberg", "彭博"],
        category: "彭博社",
      },
    ];
    // TODO 调用 API 完成一部分
    // TODO 结合
  }

  async tagArticle() {
    // TODO 调用 API 完成
  }

  concatInfo() {
    const source = this.source;
    const title = this.title;
    const content = `${this.content}<p>自 ${source}</p>`;
    const summary = this.summary;

    const article = {
      title,
      content,
      summary,
    };

    console.log(`============================\n`);

    return article;
  }
}

export default Article;
