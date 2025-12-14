const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateReview } = require("../middleware.js");
const { createReview, deleteReview } = require("../controllers/reviews");

//  Reviews 
router
  .route("/") // Create a review
  .post(isLoggedIn, validateReview, wrapAsync(createReview));

router
  .route("/:reviewId") // Delete a review
  .delete(isLoggedIn, wrapAsync(deleteReview));

module.exports = router;
