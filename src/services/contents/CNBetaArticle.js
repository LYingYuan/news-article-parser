import Article from "./Article.js";
import { load } from "cheerio";

class CNBetaArticle extends Article {
  parseTitle(article) {
    try {
      this.title = article?.title?.split(" - ")[0] || "";
    } catch (error) {
      console.error(`Error processing CNBeta article's title: ${error.message}`);
      throw error;
    }
  }

  parseContent(article, pageContent) {
    try {
      const $ = load(article.content || "");
      const $page = load(pageContent);
      const $content = $("body");

      // Remove the first image
      $content.find("img").first().remove();

      // Rewrite <img>
      $content.find("p > a >img").each((index, element) => {
        const url = $(element).attr("src");
        $(element).parent().replaceWith(`<img src="${url}" />`);
      });
      $content.find("p > img").each((index, element) => {
        let url = $(element).attr("src");
        if (url && !url.match("https")) {
          // TODO convert image
          url = `https:` + url;
        }
        $(element).parent().replaceWith(`<p align="center"><img src="${url}" alt=""></p>`);
      });

      // Article-summary
      const forewordElement = $page(".article-summary p").first();
      const foreword = forewordElement?.html().replaceAll("\n", " ").trim();
      const mainText = $content?.html()?.replace(/\s+/g, " ").trim();
      let content;

      if (!mainText.includes(foreword)) {
        content = `${foreword}${mainText}`.replace(/<a[^>]*>([^<]*)<\/a>/g, "$1").trim();
      } else {
        content = `${mainText}`.replace(/<a[^>]*>([^<]*)<\/a>/g, "$1").trim();
      }

      if (!content || content.trim() === "") {
        throw new Error("Content is empty");
      }

      this.content = content || "";
    } catch (error) {
      console.error(`Error processing CNBeta article's content: ${error.message}`);
      throw error;
    }
  }
}

export default CNBetaArticle;
