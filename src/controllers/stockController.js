import {
  getQuote,
  getOverview,
  getDailyChart,
  getNews,
  getIncomeStatement,
  getBalanceSheet,
  getCashFlow,
  getEarnings,
  getRSI,
  getMACD
} from "../services/alphaVantageService.js";

import {
  findStockByCountryAndSymbol,
  findStocksByCountry
} from "../models/stockModel.js";

const getSymbol = (req) => String(req.params.symbol || "").trim().toUpperCase();

const requireSymbol = (req, res) => {
  const symbol = getSymbol(req);

  if (!symbol) {
    res.status(400).json({
      success: false,
      message: "Stock symbol is required"
    });

    return null;
  }

  return symbol;
};

const sendServerError = (res, error, message) => {
  console.error(error.response?.data || error.message || error);

  return res.status(500).json({
    success: false,
    message
  });
};

export const getStocksByCountry = async (req, res) => {
  try {
    const { country } = req.params;

    const stocks = findStocksByCountry(country);

    res.status(200).json({
      success: true,
      country,
      count: stocks.length,
      stocks
    });

  } catch (error) {
    return sendServerError(res, error, "Failed to fetch stocks");
  }
};

export const getStockDetails = async (req, res) => {
  try {
    const { country } = req.params;
    const symbol = requireSymbol(req, res);

    if (!symbol) {
      return;
    }

    const stock = findStockByCountryAndSymbol(country, symbol);

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found"
      });
    }

    const [quote, overview] = await Promise.all([
      getQuote(symbol),
      getOverview(symbol)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        stock,
        quote,
        overview
      }
    });

  } catch (error) {
    return sendServerError(res, error, "Failed to fetch stock details");
  }
};


export const getStockTechnicals = async (req, res) => {
  try {
    const symbol = requireSymbol(req, res);

    if (!symbol) {
      return;
    }

    const [rsi, macd] = await Promise.all([
      getRSI(symbol),
      getMACD(symbol)
    ]);

    res.status(200).json({
      success: true,
      symbol,
      data: {
        rsi,
        macd
      }
    });

  } catch (error) {
    return sendServerError(res, error, "Failed to fetch technical indicators");
  }
};


export const getStockEarnings = async (req, res) => {
  try {
    const symbol = requireSymbol(req, res);

    if (!symbol) {
      return;
    }

    const data = await getEarnings(symbol);

    res.status(200).json({
      success: true,
      symbol,
      data
    });

  } catch (error) {
    return sendServerError(res, error, "Failed to fetch earnings");
  }
};

export const getStockCashFlow = async (req, res) => {
  try {
    const symbol = requireSymbol(req, res);

    if (!symbol) {
      return;
    }

    const data = await getCashFlow(symbol);

    res.status(200).json({
      success: true,
      symbol,
      data
    });

  } catch (error) {
    return sendServerError(res, error, "Failed to fetch cash flow");
  }
};

export const getStockBalanceSheet = async (req, res) => {
  try {
    const symbol = requireSymbol(req, res);

    if (!symbol) {
      return;
    }

    const data = await getBalanceSheet(symbol);

    res.status(200).json({
      success: true,
      symbol,
      data
    });

  } catch (error) {
    return sendServerError(res, error, "Failed to fetch balance sheet");
  }
};


export const getStockIncomeStatement = async (req, res) => {
  try {
    const symbol = requireSymbol(req, res);

    if (!symbol) {
      return;
    }

    const data = await getIncomeStatement(symbol);

    res.status(200).json({
      success: true,
      symbol,
      data
    });

  } catch (error) {
    return sendServerError(res, error, "Failed to fetch income statement");
  }
};

export const getStockChart = async (req, res) => {
  try {
    const symbol = requireSymbol(req, res);

    if (!symbol) {
      return;
    }

    const data = await getDailyChart(symbol);

    res.status(200).json({
      success: true,
      symbol,
      data
    });

  } catch (error) {
    return sendServerError(res, error, "Failed to fetch stock chart");
  }
};

export const getStockOverview = async (req, res) => {
  try {
    const symbol = requireSymbol(req, res);

    if (!symbol) {
      return;
    }

    const data = await getOverview(symbol);

    res.status(200).json({
      success: true,
      symbol,
      data
    });

  } catch (error) {
    return sendServerError(res, error, "Failed to fetch stock overview");
  }
};

export const getStockNews = async (req, res) => {
  try {
    const symbol = requireSymbol(req, res);

    if (!symbol) {
      return;
    }

    const data = await getNews(symbol);

    res.status(200).json({
      success: true,
      symbol,
      data
    });

  } catch (error) {
    return sendServerError(res, error, "Failed to fetch stock news");
  }
};


export const getStockQuote = async (req, res) => {
  try {
    const symbol = requireSymbol(req, res);

    if (!symbol) {
      return;
    }

    const data = await getQuote(symbol);

    res.status(200).json({
      success: true,
      symbol,
      data
    });

  } catch (error) {
    return sendServerError(res, error, "Failed to fetch stock quote");
  }
};
