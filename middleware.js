// middleware.js
const { listingSchema, reviewSchema } = require("./Schema.js");

module.exports.isLoggedIn = (req, res, next) => {
 
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl; // ✅ Store original page
    req.flash("error", "You must be logged in to access this page!");
    return res.redirect("/login");
  }

  next();
};

// ✅ Used after login to restore original page
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.redirectUrl = req.session.returnTo;
    delete req.session.returnTo;
  }
  next();
};


module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    req.flash("error", msg);
    return res.redirect("back");
  }
  next();
};