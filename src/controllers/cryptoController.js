import axios from "axios";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

export const getCrypto = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Crypto name is required"
      });
    }

    const response = await axios.get(
      `${COINGECKO_BASE_URL}/coins/${name.toLowerCase()}`,
      {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false
        },
        headers: process.env.COINGECKO_API_KEY
          ? {
              "x-cg-demo-api-key": process.env.COINGECKO_API_KEY
            }
          : {}
      }
    );

    const data = response.data;
    const market = data.market_data;

    const result = {
      id: data.id,
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      image: data.image?.large || null,

      price: {
        usd: market.current_price?.usd ?? null,
        inr: market.current_price?.inr ?? null
      },

      change: {
        "1h": market.price_change_percentage_1h_in_currency?.usd ?? null,
        "24h": market.price_change_percentage_24h_in_currency?.usd ?? null,
        "7d": market.price_change_percentage_7d_in_currency?.usd ?? null,
        "30d": market.price_change_percentage_30d_in_currency?.usd ?? null,
        "1y": market.price_change_percentage_1y_in_currency?.usd ?? null
      },

      market: {
        marketCap: market.market_cap?.usd ?? null,
        marketCapRank: market.market_cap_rank ?? null,
        volume24h: market.total_volume?.usd ?? null,
        fullyDilutedValuation:
          market.fully_diluted_valuation?.usd ?? null
      },

      trading: {
        high24h: market.high_24h?.usd ?? null,
        low24h: market.low_24h?.usd ?? null
      },

      supply: {
        circulating: market.circulating_supply ?? null,
        total: market.total_supply ?? null,
        max: market.max_supply ?? null
      },

      historical: {
        ath: market.ath?.usd ?? null,
        athChangePercentage:
          market.ath_change_percentage?.usd ?? null,

        atl: market.atl?.usd ?? null,
        atlChangePercentage:
          market.atl_change_percentage?.usd ?? null
      },

      lastUpdated: market.last_updated
    };

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error(
      "Crypto Controller Error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Cryptocurrency not found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cryptocurrency data"
    });
  }
};