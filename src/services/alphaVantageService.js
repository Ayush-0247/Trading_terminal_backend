// services/alphaVantageService.js

import axios from "axios";
import { getOrSetCached } from "../utils/cache.js";

const BASE_URL = "https://www.alphavantage.co/query";

const alphaVantage = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

const DEFAULT_TTL_MS = 60 * 1000;
const FUNDAMENTALS_TTL_MS = 60 * 60 * 1000;

const normalizeSymbol = (symbol) => String(symbol || "").trim().toUpperCase();

const buildCacheKey = (params) =>
  `alpha-vantage:${JSON.stringify(params)}`;

const requestAlphaVantage = async (params, ttlMs = DEFAULT_TTL_MS) => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    throw new Error("ALPHA_VANTAGE_API_KEY is not configured");
  }

  const requestParams = {
    ...params,
    apikey: apiKey
  };

  return getOrSetCached(
    buildCacheKey(params),
    ttlMs,
    async () => {
      const response = await alphaVantage.get("", {
        params: requestParams
      });

      return response.data;
    }
  );
};

export const getQuote = async (symbol) =>
  requestAlphaVantage({
    function: "GLOBAL_QUOTE",
    symbol: normalizeSymbol(symbol)
  });

export const getOverview = async (symbol) =>
  requestAlphaVantage(
    {
      function: "OVERVIEW",
      symbol: normalizeSymbol(symbol)
    },
    FUNDAMENTALS_TTL_MS
  );

export const getDailyChart = async (symbol) =>
  requestAlphaVantage({
    function: "TIME_SERIES_DAILY",
    symbol: normalizeSymbol(symbol),
    outputsize: "compact"
  });

export const getNews = async (symbol) =>
  requestAlphaVantage({
    function: "NEWS_SENTIMENT",
    tickers: normalizeSymbol(symbol)
  });

export const getIncomeStatement = async (symbol) =>
  requestAlphaVantage(
    {
      function: "INCOME_STATEMENT",
      symbol: normalizeSymbol(symbol)
    },
    FUNDAMENTALS_TTL_MS
  );

export const getBalanceSheet = async (symbol) =>
  requestAlphaVantage(
    {
      function: "BALANCE_SHEET",
      symbol: normalizeSymbol(symbol)
    },
    FUNDAMENTALS_TTL_MS
  );

export const getCashFlow = async (symbol) =>
  requestAlphaVantage(
    {
      function: "CASH_FLOW",
      symbol: normalizeSymbol(symbol)
    },
    FUNDAMENTALS_TTL_MS
  );

export const getEarnings = async (symbol) =>
  requestAlphaVantage(
    {
      function: "EARNINGS",
      symbol: normalizeSymbol(symbol)
    },
    FUNDAMENTALS_TTL_MS
  );

export const getRSI = async (symbol) =>
  requestAlphaVantage({
    function: "RSI",
    symbol: normalizeSymbol(symbol),
    interval: "daily",
    time_period: 14,
    series_type: "close"
  });

export const getMACD = async (symbol) =>
  requestAlphaVantage({
    function: "MACD",
    symbol: normalizeSymbol(symbol),
    interval: "daily",
    series_type: "close"
  });
