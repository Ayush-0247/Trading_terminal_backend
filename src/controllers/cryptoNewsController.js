import axios from "axios";

export const getCryptoNews = async (req, res) => {
  try {
    const { name } = req.params;

    if (!process.env.GNEWS_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "GNEWS_API_KEY is missing in .env"
      });
    }

    const response = await axios.get(
      "https://gnews.io/api/v4/search",
      {
        params: {
          q: `${name} crypto`,
          lang: "en",
          max: 10,
          sortby: "publishedAt",
          token: process.env.GNEWS_API_KEY
        }
      }
    );

    const articles = response.data.articles || [];

    const news = articles.map((article) => ({
      title: article.title,
      description: article.description,
      source: article.source?.name || null,
      url: article.url,
      image: article.image || null,
      publishedAt: article.publishedAt
    }));

    res.status(200).json({
      success: true,
      data: {
        crypto: name,
        news
      }
    });

  } catch (error) {
    console.error(
      "NEWS ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch crypto news",
      error: error.response?.data || error.message
    });
  }
};