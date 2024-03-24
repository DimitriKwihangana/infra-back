// models/article.js
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    paragraph: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    }
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
