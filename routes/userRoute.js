const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user");

// Signup
router.route("/signup")
    .get(userController.renderSignup)
    .post(userController.signup);

// Login
router.route("/login")
    .get(userController.renderLogin)
    .post( userController.login);

// Logout
router.get("/logout", userController.logout);

module.exports = router;
