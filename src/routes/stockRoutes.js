

import express from "express";

import {
  getStockDetails,
  getStockQuote,
  getStockOverview,
  getStockChart,
  getStockNews,
  getStockIncomeStatement,
  getStockBalanceSheet,
  getStockCashFlow,
  getStockEarnings,
  getStockTechnicals,
  getStocksByCountry
} from "../controllers/stockController.js";

const router = express.Router();

router.get(
  "/country/:country",
  getStocksByCountry
);

router.get(
  "/:country/:symbol",
  getStockDetails
);

router.get(
  "/:country/:symbol/quote",
  getStockQuote
);


router.get(
  "/:country/:symbol/overview",
  getStockOverview
);

router.get(
  "/:country/:symbol/chart",
  getStockChart
);

router.get(
  "/:country/:symbol/news",
  getStockNews
);

router.get(
  "/:country/:symbol/financials/income",
  getStockIncomeStatement
);

router.get(
  "/:country/:symbol/financials/balance-sheet",
  getStockBalanceSheet
);

router.get(
  "/:country/:symbol/financials/cash-flow",
  getStockCashFlow
);

router.get(
  "/:country/:symbol/earnings",
  getStockEarnings
);

router.get(
  "/:country/:symbol/technicals",
  getStockTechnicals
);

export default router;





// 1. http://localhost:5000/api/stocks/country/India

// 2. http://localhost:5000/api/stocks/India/TCS.BSE/quote

// 3. http://localhost:5000/api/stocks/India/TCS.BSE/overview

// 4. http://localhost:5000/api/stocks/India/TCS.BSE/chart

// 5. http://localhost:5000/api/stocks/India/TCS.BSE/news

// 6. http://localhost:5000/api/stocks/India/TCS.BSE/financials/income

// 7. http://localhost:5000/api/stocks/India/TCS.BSE/financials/balance-sheet

// 8. http://localhost:5000/api/stocks/India/TCS.BSE/financials/cash-flow

// 9. http://localhost:5000/api/stocks/India/TCS.BSE/earnings

// 10. http://localhost:5000/api/stocks/India/TCS.BSE/technicals