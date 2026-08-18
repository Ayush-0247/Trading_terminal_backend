import express from "express";

import { getCrypto } from "../controllers/cryptoController.js";
import { getCryptoChart } from "../controllers/cryptoChartController.js";
import { getCryptoPerformance } from "../controllers/cryptoPerformanceController.js";
import { getCryptoDerivatives } from "../controllers/cryptoDerivativesController.js";
import { getCryptoNews } from "../controllers/cryptoNewsController.js";
import { getAllcryptoNames } from "../controllers/cryptoAllname.js";
const router = express.Router();

// More specific routes FIRST
router.get("/:name/chart", getCryptoChart);

router.get("/:name/performance", getCryptoPerformance);

router.get("/:name/derivatives", getCryptoDerivatives);

router.get("/:name/news", getCryptoNews);

// Basic crypto data LAST
router.get("/:name", getCrypto);

// all crypto name
router.get("/", getAllcryptoNames);

export default router;