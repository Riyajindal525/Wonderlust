const User = require("../models/User");
const passport = require("passport");

// Render Signup Page
module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
};

// Signup Logic
module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wonderlust!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Render Login Page
module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res, next) => {
    try {
        const { username } = req.body;

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            req.flash("error", "User not found!");
            return res.redirect("/login");
        }

        // 🔥 Manually login the user (VERY IMPORTANT)
        req.login(user, (err) => {
            if (err) return next(err);

            req.flash("success", `Welcome back, ${user.username}!`);
            return res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", "Something went wrong!");
        return res.redirect("/login");
    }
};
// Logout Logic
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Successfully logged out!");
        res.redirect("/listings");
    });
};
