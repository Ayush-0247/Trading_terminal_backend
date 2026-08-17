import axios from "axios";

const BINANCE_BASE_URL = "https://fapi.binance.com/fapi/v1";

const cryptoToBinanceSymbol = {
  bitcoin: "BTCUSDT",
  ethereum: "ETHUSDT",
  solana: "SOLUSDT",
  binancecoin: "BNBUSDT",
  ripple: "XRPUSDT",
  cardano: "ADAUSDT",
  dogecoin: "DOGEUSDT",
  avalanche: "AVAXUSDT",
  chainlink: "LINKUSDT",
  polkadot: "DOTUSDT"
};

export const getCryptoDerivatives = async (req, res) => {
  try {
    const { name } = req.params;

    const symbol =
      cryptoToBinanceSymbol[name.toLowerCase()];

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: `No Binance futures symbol mapped for ${name}`
      });
    }

    const [
      tickerResponse,
      openInterestResponse,
      fundingResponse
    ] = await Promise.all([
      axios.get(`${BINANCE_BASE_URL}/ticker/24hr`, {
        params: {
          symbol
        }
      }),

      axios.get(`${BINANCE_BASE_URL}/openInterest`, {
        params: {
          symbol
        }
      }),

      axios.get(`${BINANCE_BASE_URL}/premiumIndex`, {
        params: {
          symbol
        }
      })
    ]);

    const ticker = tickerResponse.data;
    const openInterest = openInterestResponse.data;
    const funding = fundingResponse.data;

    res.status(200).json({
      success: true,

      data: {
        symbol,

        price: {
          current: Number(ticker.lastPrice),
          high24h: Number(ticker.highPrice),
          low24h: Number(ticker.lowPrice)
        },

        volume: {
          volume24h: Number(ticker.volume),
          quoteVolume24h: Number(ticker.quoteVolume)
        },

        priceChange24h: Number(
          ticker.priceChangePercent
        ),

        openInterest: Number(
          openInterest.openInterest
        ),

        fundingRate: Number(
          funding.lastFundingRate
        ),

        nextFundingTime:
          funding.nextFundingTime
      }
    });

  } catch (error) {
    console.error(
      "DERIVATIVES ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch derivatives data",
      error: error.response?.data || error.message
    });
  }
};