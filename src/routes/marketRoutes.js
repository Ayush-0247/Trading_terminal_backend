import express from "express";

import {
  getMarketPrice,
  getMarketDetails,
  getMarketChart,
  searchMarketAssets
} from "../controllers/marketController.js";

const router = express.Router();


// Search assets
router.get(
  "/search",
  searchMarketAssets
);


// Current price
router.get(
  "/:symbol/price",
  getMarketPrice
);


// Detailed market data
router.get(
  "/:symbol",
  getMarketDetails
);


// Historical chart
router.get(
  "/:symbol/chart",
  getMarketChart
);


export default router;