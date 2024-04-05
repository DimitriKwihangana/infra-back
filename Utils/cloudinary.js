const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dkmz21mob',
  api_key: '345352633482687',
  api_secret: 'tRoRlLd3ayXEi9EU1g0zWpkELjc'
});

module.exports = cloudinary;