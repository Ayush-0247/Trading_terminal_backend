// models/stockModel.js

const stocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    country: "United States",
    exchange: "NASDAQ",
    currency: "USD",
    type: "Common Stock"
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    country: "United States",
    exchange: "NASDAQ",
    currency: "USD",
    type: "Common Stock"
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    country: "United States",
    exchange: "NASDAQ",
    currency: "USD",
    type: "Common Stock"
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    country: "United States",
    exchange: "NASDAQ",
    currency: "USD",
    type: "Common Stock"
  },
  {
    symbol: "RELIANCE.BSE",
    name: "Reliance Industries Limited",
    country: "India",
    exchange: "BSE",
    currency: "INR",
    type: "Common Stock"
  },
  {
    symbol: "TCS.BSE",
    name: "Tata Consultancy Services Limited",
    country: "India",
    exchange: "BSE",
    currency: "INR",
    type: "Common Stock"
  },
  {
    symbol: "INFY.BSE",
    name: "Infosys Limited",
    country: "India",
    exchange: "BSE",
    currency: "INR",
    type: "Common Stock"
  }
];

const normalizeCountry = (country) =>
  String(country || "")
    .trim()
    .toLowerCase();

const normalizeSymbol = (symbol) =>
  String(symbol || "")
    .trim()
    .toUpperCase();

export const findStocksByCountry = (country) => {
  const normalizedCountry = normalizeCountry(country);

  return stocks
    .filter((stock) => normalizeCountry(stock.country) === normalizedCountry)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const findStockByCountryAndSymbol = (country, symbol) => {
  const normalizedCountry = normalizeCountry(country);
  const normalizedSymbol = normalizeSymbol(symbol);

  return stocks.find(
    (stock) =>
      normalizeCountry(stock.country) === normalizedCountry &&
      normalizeSymbol(stock.symbol) === normalizedSymbol
  ) || null;
};

export default stocks;
