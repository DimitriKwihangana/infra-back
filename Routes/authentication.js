const express = require("express");
const router = express.Router();
const { Register, getUserById } = require("../controller/authController");
const { login } = require("../controller/authController");
const {  updateUserInfo }  = require("../controller/authController");

router.route("/register").post(Register);
router.route("/login").post(login);
router.route("/update/:id").put(updateUserInfo)
router.route("/user/:id").get(getUserById)

module.exports = router;
