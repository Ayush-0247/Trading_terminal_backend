import axios from "axios";

const GNEWS_URL = "https://gnews.io/api/v4/search";

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const normalizeArticles = (articles = []) => {
  return articles.map((article, index) => ({
    id: `${Date.now()}-${index}`,

    title: article.title,

    description: article.description,

    content: article.content,

    image: article.image,

    url: article.url,

    source: article.source?.name || "Unknown",

    sourceUrl: article.source?.url || null,

    publishedAt: article.publishedAt,

    category: "global",
  }));
};


export const fetchNews = async ({
  query = "world",
  lang = "en",
  max = 10,
  from,
  to,
}) => {

  const params = {
    q: query,
    lang,
    max,
    sortby: "publishedAt",
    apikey: process.env.GNEWS_API_KEY,
  };

  if (from) {
    params.from = from;
  }

  if (to) {
    params.to = to;
  }

  const response = await axios.get(
    GNEWS_URL,
    { params }
  );

  return {
    totalArticles:
      response.data.totalArticles || 0,

    articles: normalizeArticles(
      response.data.articles
    ),
  };
};


export const fetchAssetNews = async ({
  type,
  symbol,
  max = 10,
}) => {

  const queries = {

    stock: {
      AAPL: "Apple OR AAPL",
      TSLA: "Tesla OR TSLA",
      MSFT: "Microsoft OR MSFT",
      GOOGL: "Google OR Alphabet",
      AMZN: "Amazon OR AMZN",
      NVDA: "Nvidia OR NVDA",
    },

    crypto: {
      BTC: "Bitcoin OR BTC",
      ETH: "Ethereum OR ETH",
      SOL: "Solana OR SOL",
      XRP: "XRP",
      DOGE: "Dogecoin OR DOGE",
    },

    commodity: {
      WTI:
        '"WTI" OR "West Texas Intermediate" OR "crude oil"',

      BRENT:
        '"Brent crude" OR "Brent oil"',

      XAU:
        '"Gold price" OR "gold market"',

      XAG:
        '"Silver price" OR "silver market"',

      NATURAL_GAS:
        '"natural gas"',

      COPPER:
        '"copper price" OR "copper market"',

      ALUMINUM:
        '"aluminium price" OR "aluminum price"',
    },
  };


  const query =
    queries[type]?.[symbol] ||
    `${symbol} ${type}`;


  return fetchNews({
    query,
    max,
  });
};