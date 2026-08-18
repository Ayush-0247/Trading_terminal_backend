import axios from "axios";

const GNEWS_URL = "https://gnews.io/api/v4/search";

export const getNews = async (req, res) => {
  try {
    const { query } = req.params;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "News query is required",
      });
    }

    const response = await axios.get(GNEWS_URL, {
      params: {
        q: query,
        lang: "en",
        max: 10,
        sortby: "publishedAt",
        apikey: process.env.GNEWS_API_KEY,
      },
    });

    const result = response.data;

    const articles = (result.articles || []).map(
      (article, index) => ({
        id: `${query}-${index}`,

        title: article.title,

        description: article.description,

        content: article.content,

        image: article.image,

        url: article.url,

        source: article.source?.name || "Unknown",

        sourceUrl: article.source?.url || null,

        publishedAt: article.publishedAt,

        category: "global",
      })
    );

    return res.status(200).json({
      success: true,

      query,

      count: articles.length,

      data: articles,
    });

  } catch (error) {

    console.error(
      "GNEWS ERROR:",
      error.response?.data || error.message
    );

    if (error.response?.status === 403) {
      return res.status(403).json({
        success: false,
        message:
          "GNews API limit reached or API key is invalid",
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message:
          error.response?.data?.errors?.join(", ") ||
          "Invalid GNews request",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};