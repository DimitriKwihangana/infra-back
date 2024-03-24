// controllers/articleController.js
const multer = require("multer");
const path = require("path");
const Article = require("../model/article");
// Set storage engine
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 3000000}, // 1MB
}).single("photo");

const articleController = {
    // Create a new article
    createArticle: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                res.status(400).json({ message: err.message });
            } else {
                try {
                    const { paragraph } = req.body;
                    const photo = req.file.filename;
                    const article = new Article({ paragraph, photo });
                    await article.save();
                    res.status(201).json(article);
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            }
        });
    },
    // Get all articles
    getAllArticles: async (req, res) => {
        try {
            const articles = await Article.find();
            res.json(articles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Get an article by ID
    getArticleById: async (req, res) => {
        try {
            const { id } = req.params;
            const article = await Article.findById(id);
            if (!article) {
                return res.status(404).json({ message: "Article not found" });
            }
            res.json(article);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = articleController;
