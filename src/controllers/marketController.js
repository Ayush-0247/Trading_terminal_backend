import axios from "axios";

const TWELVE_DATA_URL = "https://api.twelvedata.com";

const getAssetType = (symbol) => {
  if (
    symbol.includes("/") &&
    (symbol.startsWith("XAU") ||
      symbol.startsWith("XAG"))
  ) {
    return "commodity";
  }

  if (symbol.includes("/")) {
    return "forex";
  }

  return "unknown";
};


// Get current price
export const getMarketPrice = async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: "Asset symbol is required"
      });
    }

    const response = await axios.get(
      `${TWELVE_DATA_URL}/price`,
      {
        params: {
          symbol: symbol.toUpperCase(),
          apikey: process.env.TWELVE_DATA_API_KEY
        }
      }
    );

    if (response.data.status === "error") {
      return res.status(400).json({
        success: false,
        message: response.data.message
      });
    }

    return res.status(200).json({
      success: true,

      data: {
        symbol: symbol.toUpperCase(),
        price: Number(response.data.price)
      }
    });

  } catch (error) {
    console.error(
      "MARKET PRICE ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch market price"
    });
  }
};


// Get detailed market data
export const getMarketDetails = async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: "Asset symbol is required"
      });
    }

    const upperSymbol = symbol.toUpperCase();

    const response = await axios.get(
      `${TWELVE_DATA_URL}/quote`,
      {
        params: {
          symbol: upperSymbol,
          apikey: process.env.TWELVE_DATA_API_KEY
        }
      }
    );

    const data = response.data;

    if (data.status === "error") {
      return res.status(400).json({
        success: false,
        message: data.message
      });
    }

    return res.status(200).json({
      success: true,

      data: {
        symbol: upperSymbol,

        name: data.name || null,

        price: Number(data.close) || null,

        change: Number(data.change) || null,

        percentChange:
          Number(data.percent_change) || null,

        open: Number(data.open) || null,

        high: Number(data.high) || null,

        low: Number(data.low) || null,

        previousClose:
          Number(data.previous_close) || null,

        volume:
          data.volume
            ? Number(data.volume)
            : null,

        averageVolume:
          data.average_volume
            ? Number(data.average_volume)
            : null,

        type: getAssetType(upperSymbol),

        exchange: data.exchange || null,

        currency: data.currency || null,

        timestamp: data.timestamp || null
      }
    });

  } catch (error) {
    console.error(
      "MARKET DETAILS ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch market data"
    });
  }
};


// Historical chart
export const getMarketChart = async (req, res) => {
  try {
    const { symbol } = req.params;

    const range =
      (req.query.range || "1D").toUpperCase();

    const interval =
      req.query.interval || "1h";

    const rangeToOutputSize = {
      "1D": 24,
      "1W": 168,
      "1M": 720,
      "3M": 2160,
      "6M": 4320,
      "1Y": 8760
    };

    const outputsize =
      rangeToOutputSize[range] || 24;

    const response = await axios.get(
      `${TWELVE_DATA_URL}/time_series`,
      {
        params: {
          symbol: symbol.toUpperCase(),
          interval,
          outputsize,
          timezone: "UTC",
          apikey: process.env.TWELVE_DATA_API_KEY
        }
      }
    );

    const data = response.data;

    if (data.status === "error") {
      return res.status(400).json({
        success: false,
        message: data.message
      });
    }

    const values = data.values || [];

    const chart = values
      .reverse()
      .map((item) => ({
        datetime: item.datetime,
        open: Number(item.open),
        high: Number(item.high),
        low: Number(item.low),
        close: Number(item.close),
        volume: item.volume
          ? Number(item.volume)
          : null
      }));

    return res.status(200).json({
      success: true,

      data: {
        symbol: symbol.toUpperCase(),
        range,
        interval,
        chart
      }
    });

  } catch (error) {
    console.error(
      "MARKET CHART ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch market chart"
    });
  }
};


// Search assets
export const searchMarketAssets = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const response = await axios.get(
      `${TWELVE_DATA_URL}/symbol_search`,
      {
        params: {
          symbol: q,
          apikey: process.env.TWELVE_DATA_API_KEY
        }
      }
    );

    const data = response.data;

    if (data.status === "error") {
      return res.status(400).json({
        success: false,
        message: data.message
      });
    }

    const results = (data.data || []).map(
      (asset) => ({
        symbol: asset.symbol,
        name: asset.instrument_name,
        type: asset.instrument_type,
        exchange: asset.exchange,
        country: asset.country,
        currency: asset.currency
      })
    );

    return res.status(200).json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error(
      "MARKET SEARCH ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to search market assets"
    });
  }
};















// Yes. If you're talking about the Twelve Data global-market API, you should design your frontend around a normalized asset object rather than trying to render every raw field the provider can return.

// For your trading terminal, I would support these asset categories:

// Stocks
// ETFs
// Forex
// Commodities
// Indices
// Crypto
// Bonds / Fixed Income
// Funds
// Data you can render for each asset
// 1. Identity
// {
//   symbol,
//   name,
//   type,
//   exchange,
//   mic_code,
//   country,
//   currency
// }

// Frontend:

// Apple Inc.
// AAPL
// Stock
// NASDAQ
// United States
// USD
// 2. Current price
// {
//   price,
//   change,
//   percentChange,
//   previousClose
// }

// Frontend:

// $227.16
// +$2.41
// +1.07%
// Previous close: $224.75
// 3. Trading range
// {
//   open,
//   high,
//   low,
//   previousClose
// }

// Render:

// Open        $224.75
// High        $228.40
// Low         $223.10
// Prev Close  $224.75
// 4. Volume
// {
//   volume,
//   averageVolume
// }

// Render:

// Volume       42.8M
// Avg Volume   38.2M

// For stocks this is particularly useful.

// 5. Market information

// Depending on the asset/provider, you may have:

// {
//   marketCap,
//   sharesOutstanding,
//   floatShares,
//   marketCapRank
// }

// These are primarily useful for equities/crypto rather than every asset class.

// 6. Valuation

// For stocks/funds where fundamentals are available:

// {
//   peRatio,
//   pegRatio,
//   priceToBook,
//   priceToSales,
//   enterpriseValue
// }

// You can render:

// P/E          31.4
// P/B           8.7
// P/S          12.1
// EV           $3.4T

// Don't expect these fields for Gold, EUR/USD, Brent crude, etc. They're asset-class dependent.

// 7. 52-week statistics

// For supported securities:

// {
//   week52High,
//   week52Low
// }

// Render:

// 52W High     $260.10
// 52W Low      $164.08
// 8. Performance

// Your terminal can calculate:

// {
//   "1D": 1.07,
//   "1W": 2.41,
//   "1M": -3.82,
//   "3M": 8.12,
//   "6M": 14.51,
//   "YTD": 12.44,
//   "1Y": 28.31,
//   "5Y": 143.21,
//   "ALL": 1200.42
// }

// This is calculated from historical prices rather than being a universal quote field.

// 9. Historical chart

// This is probably the most important frontend component.

// Your API can return OHLCV:

// {
//   datetime,
//   open,
//   high,
//   low,
//   close,
//   volume
// }

// Example:

// {
//   "datetime": "2026-08-17 10:00:00",
//   "open": 227.10,
//   "high": 228.20,
//   "low": 226.80,
//   "close": 227.90,
//   "volume": 1245000
// }

// Then your chart can support:

// 1D
// 1W
// 1M
// 3M
// 6M
// 1Y
// 5Y
// MAX

// and potentially intervals:

// 1min
// 5min
// 15min
// 30min
// 1h
// 4h
// 1day
// 1week
// 1month
// 10. Forex-specific data

// For:

// USD/INR
// EUR/USD
// GBP/USD
// USD/JPY

// you'd render:

// Bid
// Ask
// Spread
// Open
// High
// Low
// Previous Close
// Change
// % Change

// For example:

// USD/INR


// Bid       87.42
// Ask       87.44
// Spread     0.02


// Open      87.31
// High      87.58
// Low       87.20

// This is much more relevant to a forex trader than market cap.

// 11. Commodity-specific data

// For:

// Gold
// Silver
// Brent
// WTI
// Natural Gas
// Copper

// you'd want:

// Price
// Change
// % Change
// Open
// High
// Low
// Previous Close
// Volume

// And where supported:

// Contract
// Expiration
// Exchange
// Unit

// For example:

// GOLD


// $4,350.72
// +0.91%


// Open          $4,310.20
// High          $4,382.10
// Low           $4,295.40
// Previous      $4,311.50


// Unit          USD / Troy Ounce
// 12. Index-specific data

// For:

// S&P 500
// NASDAQ 100
// Dow Jones
// NIFTY 50
// SENSEX
// DAX
// Nikkei 225

// you'd show:

// Index Value
// Change
// % Change
// Open
// High
// Low
// Previous Close

// Example:

// S&P 500


// 6,418.55
// +0.48%


// Open       6,390.20
// High       6,430.10
// Low        6,375.30
// Prev       6,388.00
// 13. Stock-specific data

// For stocks, your terminal can eventually become much richer.

// Price
// Price
// Change
// % Change
// Open
// High
// Low
// Previous Close
// Volume
// Volume
// Average Volume
// Market
// Market Cap
// Shares Outstanding
// Float
// Valuation
// P/E
// Forward P/E
// P/B
// P/S
// PEG
// EV/EBITDA
// Dividend
// Dividend Yield
// Dividend Per Share
// Ex-Dividend Date
// Earnings
// EPS
// EPS Growth
// Revenue
// Revenue Growth
// Earnings Date

// These belong in a fundamentals section rather than your universal asset object.

// 14. Crypto

// Your existing crypto system can remain richer than the global-market system.

// For crypto:

// Price
// 24h Change
// Market Cap
// Market Cap Rank
// 24h Volume
// FDV
// 24h High
// 24h Low


// Circulating Supply
// Total Supply
// Max Supply


// ATH
// ATL


// Open Interest
// Funding Rate
// Liquidations
// Long/Short Ratio

// And:

// News
// Chart
// Performance
// 15. The important part: don't make one giant object

// I recommend your backend response look like this:

// {
//   asset: {
//     symbol: "AAPL",
//     name: "Apple Inc.",
//     type: "stock",
//     exchange: "NASDAQ",
//     country: "United States",
//     currency: "USD"
//   },


//   quote: {
//     price: 227.16,
//     change: 2.41,
//     percentChange: 1.07,
//     previousClose: 224.75,


//     open: 224.75,
//     high: 228.40,
//     low: 223.10,


//     volume: 42800000,
//     averageVolume: 38200000
//   },


//   market: {
//     marketCap: 3400000000000
//   },


//   fundamentals: {
//     peRatio: 31.4,
//     priceToBook: 8.7,
//     priceToSales: 12.1
//   },


//   performance: {
//     "1D": 1.07,
//     "1W": 2.41,
//     "1M": -3.82,
//     "6M": 14.51,
//     "1Y": 28.31
//   },


//   chart: [],


//   news: []
// }

// But for Gold:

// {
//   asset: {
//     symbol: "XAU/USD",
//     name: "Gold",
//     type: "commodity",
//     currency: "USD"
//   },


//   quote: {
//     price: 4350.72,
//     change: 42.18,
//     percentChange: 0.98,


//     open: 4310.20,
//     high: 4382.10,
//     low: 4295.40,
//     previousClose: 4308.54
//   },


//   commodity: {
//     unit: "Troy Ounce"
//   },


//   performance: {},


//   chart: [],


//   news: []
// }

// No fake:

// P/E: null
// Market Cap: null
// EPS: null

// unless your frontend actually needs those fields. Asset-class-specific data should be optional.

// Your frontend can then dynamically render
//                   ┌───────────────────────┐
//                   │      AAPL             │
//                   │ Apple Inc.            │
//                   │ $227.16  +1.07%       │
//                   └───────────────────────┘


//        PRICE CHART
//   1D  1W  1M  3M  6M  1Y  5Y  MAX


//        KEY DATA


//   Open             $224.75
//   High             $228.40
//   Low              $223.10
//   Volume           42.8M
//   Market Cap       $3.4T
//   P/E              31.4


//        PERFORMANCE


//   1D    +1.07%
//   1W    +2.41%
//   1M    -3.82%
//   YTD   +12.4%
//   1Y    +28.3%


//        NEWS
//   ─────────────────────
//   ...

// And when the user selects Gold, the same UI automatically changes to commodity-relevant fields.

// One correction to our previous code

// The current marketController.js I gave you is not yet capable of returning all of these fields. It currently focuses on the /price, /quote, /time_series, and search data we need to get the basic terminal running.

// If your goal is a serious Bloomberg-style terminal, I'd next expand marketController.js into:

// GET /api/markets/search
// GET /api/markets/:symbol
// GET /api/markets/:symbol/chart
// GET /api/markets/:symbol/performance
// GET /api/markets/:symbol/profile
// GET /api/markets/:symbol/fundamentals

// with the frontend receiving a normalized response based on whether the asset is a stock, forex pair, commodity, index, ETF, or crypto. That is the cleaner architecture than trying to cram every possible financial metric into one response.