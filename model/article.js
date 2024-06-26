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
    },
    district:{
        type:String,
        required:true
    },
    sector:{
        type:String,
        required:true
    },
    village:{
        type:String,
        required:true
    },
    cell:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    priority: {
        type:String,
        required:true
    }
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;