const Listing = require("../models/listing");
const Review = require("../models/Review");

// Create Review Controller
module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const review = new Review(req.body.review);
  review.author = req.user._id;

  listing.reviews.push(review);

  await review.save();
  await listing.save();
  
  req.flash("success", "✅ Review added successfully!");
  res.redirect(`/listings/${listing._id}`);
};

// Delete Review Controller
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "🗑️ Review deleted successfully!");
  res.redirect(`/listings/${id}`);
};
