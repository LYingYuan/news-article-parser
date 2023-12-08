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

      // Rewrite <img>
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
      await Promise.all(imgUrls.map(async url => {
        const newUrl = await handleImage(url);
        urlMap.set(url, newUrl);
      }));

      // Replace url
      $("img").each((index, element) => {
        const url = $(element).attr("src");
        $(element).attr("src", urlMap.get(url));
      });

      // Delete a
      // $("img").each((index, element) => {
      //   const parent = $(element).
      // });

      // $content.find("p > span > a > img").each(async (index, element) => {
      //   let url = $(element).attr("src");
      //   console.log("hello");
      //   url = await handleImage(url);
      //   console.log("hello2");
      //   $(element).parent().replaceWith(`<img src="${url}" />`);
      // });

      // $content.find("p > a > img").each(async (index, element) => {
      //   let url = $(element).attr("src");
      //   url = await handleImage(url);
      //   $(element).parent().replaceWith(`<img src="${url}" />`);
      // });

      // $content.find("p > img").each(async (index, element) => {
      //   let url = $(element).attr("src");
      //   if (url && !url.match("https")) {
      //     url = `https:` + url;
      //   }
      //   url = await handleImage(url);
      //   $(element).parent().replaceWith(`<p align="center"><img src="${url}" alt=""></p>`);
      // });

      // Article-summary
      const $content = $("body");
      const $page = load(pageContent);
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

  parseSource(article, pageContent) {
    try {
      const $ = load(pageContent);
      const sourceText = $(".source span").text() ? $(".source span").text() : $(".source a").text();
      this.source = sourceText;
    } catch (error) {
      console.error(`Error processing CNBeta article's Source: ${error}`);
      throw error;
    }
  }
}

export default CNBetaArticle;
