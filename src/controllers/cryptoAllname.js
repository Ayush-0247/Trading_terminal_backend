import axios from "axios";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

export const getAllcryptoNames = async (req, res) => {
  try {
    const response = await axios.get(
      `${COINGECKO_BASE_URL}/coins/markets`,
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 10,
          page: 1,
          sparkline: false,
          price_change_percentage: "24h"
        },
        headers: process.env.COINGECKO_API_KEY
          ? {
              "x-cg-demo-api-key": process.env.COINGECKO_API_KEY
            }
          : {}
      }
    );

    const data = response.data;

    const cryptoData = data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      image: coin.image,

      currentPrice: coin.current_price,

      priceChange24h: coin.price_change_24h,

      priceChangePercentage24h:
        coin.price_change_percentage_24h,

      marketCap: coin.market_cap,
      marketCapRank: coin.market_cap_rank,

      volume24h: coin.total_volume
    }));

    return res.status(200).json({
      success: true,
      count: cryptoData.length,
      data: cryptoData
    });

  } catch (error) {
    console.error("CoinGecko Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.error ||
        error.message
    });
  }
};