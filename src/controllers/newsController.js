import {
  fetchNews,
  fetchAssetNews,
} from "../services/newsService.js";


export const getGlobalNews = async (
  req,
  res
) => {

  try {

    const {
      q = "world",
      lang = "en",
      max = 10,
      from,
      to,
    } = req.query;


    const result = await fetchNews({
      query: q,
      lang,
      max: Math.min(Number(max), 10),
      from,
      to,
    });


    return res.status(200).json({

      success: true,

      type: "global",

      query: q,

      count: result.articles.length,

      totalArticles:
        result.totalArticles,

      data: result.articles,

    });


  } catch (error) {

    console.error(
      "GLOBAL NEWS ERROR:",
      error.response?.data ||
        error.message
    );


    return res.status(
      error.response?.status === 403
        ? 403
        : 500
    ).json({

      success: false,

      message:
        error.response?.data?.errors?.join(
          ", "
        ) ||
        "Failed to fetch global news",

    });

  }
};


export const getAssetNews = async (
  req,
  res
) => {

  try {

    const {
      type,
      symbol,
    } = req.params;


    const validTypes = [
      "stock",
      "crypto",
      "commodity",
    ];


    if (!validTypes.includes(type)) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid asset type. Use stock, crypto or commodity",

      });

    }


    if (!symbol) {

      return res.status(400).json({

        success: false,

        message:
          "Asset symbol is required",

      });

    }


    const result =
      await fetchAssetNews({
        type,
        symbol:
          symbol.toUpperCase(),
        max: 10,
      });


    return res.status(200).json({

      success: true,

      type,

      symbol:
        symbol.toUpperCase(),

      count:
        result.articles.length,

      totalArticles:
        result.totalArticles,

      data: result.articles,

    });


  } catch (error) {

    console.error(
      "ASSET NEWS ERROR:",
      error.response?.data ||
        error.message
    );


    return res.status(
      error.response?.status === 403
        ? 403
        : 500
    ).json({

      success: false,

      message:
        error.response?.data?.errors?.join(
          ", "
        ) ||
        "Failed to fetch asset news",

    });

  }
};