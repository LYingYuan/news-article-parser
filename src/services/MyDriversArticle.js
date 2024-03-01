import Article from "./Article.js";
import { load } from "cheerio";

class MyDriversArticle extends Article {
  async parseContent(article, pageContent) {
    try {
      console.log("Parsing content...");

      const $ = load(pageContent || "");

      $("img").each((index, element) => {
        // Delete attribs
        Object.keys(element.attribs).forEach(attr => {
          if (attr !== "src" && attr !== "alt") {
            $(element).removeAttr(attr);
          }
        });

        let url = $(element).attr("src");
        if (url && !url.match("https")) {
          url = `https:` + url;
        }
        $(element).attr("src", url);

        // Delete <a></a>
        $(element).unwrap("a");
        // Center image
        $(element).parent().attr("align", "center");
      });

      // Delete <a></a>
      $("a").each((index, element) => {
        const html = $(element).html();
        $(element).replaceWith(html);
      });

      // Delete span tags with red font
      $("span[style]").each((index, element) => {
        const html = $(element).html();
        $(element).replaceWith(html);
      });

      $(".zhuanzai").parent().remove();
      $(".url").parent().remove();

      const $content = $(".news_info");
      let content;

      content = $content.html();

      content = content.replace(/\n/g, "").replace(/\t/g, "");
      content = content
        .replace(/(快科技)?\d+月\d+日(消息|讯|获悉)?/, "近日消息")
        .replace(/<p>\d+月\d+日*/, "<p>近日")
        .replace(/<p>近日消息，近日，*/, "<p>近日消息，");
      content = content.trim();

      if (!content || content.trim() === "") {
        throw new Error("Content is empty");
      }

      this.content = content || "";
    } catch (error) {
      console.error(`Error parsing article's content: ${error}`);
      throw error;
    }
  }

  parseSource(article) {
    try {
      console.log("Parsing source...");

      const source = article.description.match(/(?<=出处：)\S+/)[0];

      this.source = source || "";
    } catch (error) {
      console.error(`Error parsing article's source: ${error}`);
      throw error;
    }
  }
}

export default MyDriversArticle;
