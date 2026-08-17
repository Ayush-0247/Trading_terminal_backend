import axios from "axios";

const COINGECKO_BASE_URL =
  "https://api.coingecko.com/api/v3";

const getDays = (range) => {
  const ranges = {
    "1D": 1,
    "1W": 7,
    "1M": 30,
    "6M": 180,
    "1Y": 365,
    "5Y": 1825,
    "10Y": 3650
  };

  return ranges[range];
};

const calculateChange = (current, previous) => {
  if (!previous || previous === 0) {
    return null;
  }

  return ((current - previous) / previous) * 100;
};

export const getCryptoPerformance = async (req, res) => {
  try {
    const { name } = req.params;

    const ranges = [
      "1D",
      "1W",
      "1M",
      "6M",
      "1Y"
    ];

    const performance = {};

    for (const range of ranges) {
      const days = getDays(range);

      const response = await axios.get(
        `${COINGECKO_BASE_URL}/coins/${name.toLowerCase()}/market_chart`,
        {
          params: {
            vs_currency: "usd",
            days
          },
          headers: process.env.COINGECKO_API_KEY
            ? {
                "x-cg-demo-api-key":
                  process.env.COINGECKO_API_KEY
              }
            : {}
        }
      );

      const prices = response.data.prices;

      if (!prices.length) {
        performance[range] = null;
        continue;
      }

      const firstPrice = prices[0][1];

      const currentPrice =
        prices[prices.length - 1][1];

      performance[range] = calculateChange(
        currentPrice,
        firstPrice
      );
    }

    res.status(200).json({
      success: true,

      data: {
        crypto: name,
        performance
      }
    });

  } catch (error) {
    console.error(
      "PERFORMANCE ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch performance data",
      error: error.response?.data || error.message
    });
  }
};