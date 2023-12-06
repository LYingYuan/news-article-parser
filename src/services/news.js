import CNBetaArticle from "./contents/CNBetaArticle.js";

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
        // case "news.mydrivers":
        //   // 处理快科技数据
        //   const article_fast_tech = new MydriversArticle(url);
        //   await article_fast_tech.handleArticle();
        //   break;
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
