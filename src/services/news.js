import CNBetaArticle from "./CNBetaArticle.js";
import MyDriversArticle from "./MyDriversArticle.js";

async function parseArticles(urls) {
  try {
    let newsArticles = [];

    for (const url of urls) {
      const domain = url?.match(/(?<=\/\/)([a-zA-Z0-9-]+)\.[a-zA-Z]+/g)?.[0];
      switch (domain) {
        // case "www.techweb":
        //   // 处理 TechWeb 数据
        //   const article_TechWeb = new TechWebArticle(url);
        //   await article_TechWeb.handleArticle();
        //   break;
        case "news.mydrivers": {
          const article = new MyDriversArticle(url);
          const news = await article.handleArticle();
          newsArticles.push(news);
          break;
        }
        case "www.cnbeta":
        case "hot.cnbeta": {
          const article = new CNBetaArticle(url);
          const news = await article.handleArticle();
          newsArticles.push(news);
          break;
        }
        default:
          throw new Error(`No processing rules, url: ${domain}`);
      }
    }

    return newsArticles;
  } catch (error) {
    console.error(`Error parsing articles: ${error.message}`);
    throw error;
  }
}

export default parseArticles;
