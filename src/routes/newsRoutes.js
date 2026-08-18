import express from "express";

import {
  getGlobalNews,
  getAssetNews,
} from "../controllers/newsController.js";

const router = express.Router();


// Global news
router.get("/", getGlobalNews);


// Asset-specific news
router.get(
  "/asset/:type/:symbol",
  getAssetNews
);


export default router;