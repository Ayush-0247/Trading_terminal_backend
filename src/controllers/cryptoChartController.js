import axios from "axios";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

const getDaysFromRange = (range) => {
  const ranges = {
    "1D": 1,
    "1W": 7,
    "1M": 30,
    "6M": 180,
    "1Y": 365,
    "5Y": 1825,
    "10Y": 3650,
    "ALL": "max"
  };

  return ranges[range] || 1;
};

export const getCryptoChart = async (req, res) => {
  try {
    const { name } = req.params;

    const range = (req.query.range || "1D").toUpperCase();

    const allowedRanges = [
      "1D",
      "1W",
      "1M",
      "6M",
      "1Y",
      "5Y",
      "10Y",
      "ALL"
    ];

    if (!allowedRanges.includes(range)) {
      return res.status(400).json({
        success: false,
        message: `Invalid range. Use: ${allowedRanges.join(", ")}`
      });
    }

    const days = getDaysFromRange(range);

    const response = await axios.get(
      `${COINGECKO_BASE_URL}/coins/${name.toLowerCase()}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days
        },
        headers: process.env.COINGECKO_API_KEY
          ? {
              "x-cg-demo-api-key": process.env.COINGECKO_API_KEY
            }
          : {}
      }
    );

    const prices = response.data.prices.map(([timestamp, price]) => ({
      timestamp,
      price
    }));

    return res.status(200).json({
      success: true,

      data: {
        crypto: name.toLowerCase(),
        range,
        prices
      }
    });

  } catch (error) {
    console.error(
      "Chart Controller Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch chart data"
    });
  }
};