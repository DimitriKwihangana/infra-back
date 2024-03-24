const express = require("express");
const router = express.Router();
const { Register } = require("../controller/authController");
const { login } = require("../controller/authController");

router.route("/register").post(Register);
router.route("/login").post(login);

module.exports = router;
