// routes/articleRoutes.js
const express = require("express");
const articleController = require("../controller/articleController");

const router = express.Router();

// Create a new article
router.post("/articles", articleController.createArticle);

// Get all articles
router.get("/articles", articleController.getAllArticles);

// Get an article by ID
router.get("/articles/:id", articleController.getArticleById);

module.exports = router;
