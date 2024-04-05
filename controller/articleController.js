const multer = require("multer");
const Article = require("../model/article");
const cloudinary = require('../Utils/cloudinary');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

const mailer = async (mailOptions, action) => {
    try {
        await sgMail.send(mailOptions);
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Set storage engine
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 3000000 } // 3MB
}).single("photo");

const articleController = {
    // Create a new article
    createArticle: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                res.status(400).json({ message: err.message });
            } else {
                try {
                    const { paragraph, district, sector, village, cell, email, priority, damage } = req.body;
                    const photo = req.file.filename;

                    const result = await cloudinary.uploader.upload(req.file.path);
                    const article = new Article({ paragraph, district, sector, village, cell, photo: result.secure_url, email, priority, damage });
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
    },
    // Update an article by ID
    updateArticleById: async (req, res) => {
        const { id } = req.params;
        try {
            const updatedArticle = await Article.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedArticle) {
                return res.status(404).json({ message: "Article not found" });
            }
    
            // Check if the recipient email address is provided
            if (!req.body.email) {
                return res.status(400).json({ message: "Recipient email address is required" });
            }
    
            // Prepare email options
            const mailOptions = {
                from: 'dimitrikwihangana@gmail.com',
                to: req.body.email, // Add recipient email address here
                subject: "Thank you for your input",
                html: `<p> Hi thank you for joining report the infrastructure located in ${req.body.district}
                        it's level of priority is <strong>${req.body.priority}</strong> <br/>
                       We'll start to work on it as soon as possible!  <br/> Regards`
            };
            // Send email after updating the article
            await mailer(mailOptions, 'Updated');
            res.json(updatedArticle);
        } catch (error) {
            console.error('Error updating article:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    
};

module.exports = articleController;
