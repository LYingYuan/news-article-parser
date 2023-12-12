import Article from "./Article.js";
import { load } from "cheerio";
import handleImage from "./images.js";

class CNBetaArticle extends Article {
  parseTitle(article) {
    try {
      this.title = article?.title?.split(" - ")[0] || "";
    } catch (error) {
      console.error(`Error processing CNBeta article's title: ${error.message}`);
      throw error;
    }
  }

  async parseContent(article, pageContent) {
    try {
      const $ = load(article.content || "");

      // Remove the first image
      $("img").first().remove();

      // Rewrite <img />
      const imgUrls = $("img")
        .map((index, element) => {
          let url = $(element).attr("src");
          if (url && !url.match("https")) {
            url = `https:` + url;
          }
          return url;
        })
        .get();

      const urlMap = new Map();
      await Promise.all(
        imgUrls.map(async url => {
          const newUrl = await handleImage(url);
          urlMap.set(url, newUrl);
        })
      );

      // Replace url
      $("img").each((index, element) => {
        const url = $(element).attr("src");
        $(element).attr("src", urlMap.get(url));
      });

      $("img").each((index, element) => {
        // Delete <a></a>
        $(element).unwrap("a");
        // Delete <span></span>
        $(element).unwrap("span");
        // Delete <br>
        $(element).siblings("br").remove();
        // Center image
        $(element).parent().attr("align", "center");
      });

      // Article content
      const $content = $("body");
      const $page = load(pageContent);
      const forewordElement = $page(".article-summary p").first();
      const foreword = forewordElement?.html().replaceAll("\n", " ").trim();
      const mainText = $content?.html()?.replace(/\s+/g, " ").trim();
      let content;

      if (!mainText.includes(foreword)) {
        content = `${foreword}${mainText}`;
      } else {
        content = `${mainText}`;
      }

      // Extract the inner text from a tag
      content = content.replace(/<a[^>]*>([^<]*)<\/a>/g, "$1").trim();

      if (!content || content.trim() === "") {
        throw new Error("Content is empty");
      }

      this.content = content || "";
    } catch (error) {
      console.error(`Error processing CNBeta article's content: ${error.message}`);
      throw error;
    }
  }

  parseSource(article, pageContent) {
    try {
      const $ = load(pageContent);
      let sourceText = "";
      if ($(".source span").text()) {
        sourceText = $(".source span").text();
      } else if ($(".source a").text()) {
        sourceText = $(".source a").text();
      } else if ($("span.source").text()) {
        sourceText = $("span.source").text().replace("稿源：", "");
      }

      this.source = sourceText;
    } catch (error) {
      console.error(`Error processing CNBeta article's Source: ${error}`);
      throw error;
    }
  }
}

export default CNBetaArticle;
