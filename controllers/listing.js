const Listing = require("../models/listing");
const Review = require("../models/Review");
const ExpressError = require("../utils/ExpressError.js");
const mbxStyles = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxStyles({ accessToken: mapToken });


// Show all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
 
   res.render("listings/index", { allListings });

};

// Render new listing form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// Create new listing
module.exports.createListing = async (req, res) => {
   const coordinates = await geocodingClient.forwardGeocode({
  query: ''+ req.body.location +', '+ req.body.country,
  limit: 1
})
  .send()

 // Ensure categories is always stored as array
  let categories = req.body.categories;
  if (typeof categories === "string") {
    categories = [categories];
  }
  

    let url = req.file.path  ;
   let filename = req.file.filename ;

  const { title, description, price, location, country } = req.body;

  // Basic validation
  if (!title || !description || !price || !location || !country) {
    throw new ExpressError(400, "All fields are required to create a listing");
  }

  const newListing = new Listing({
    title,
    description,
    price: Number(price),
    location,
    country,
    owner: req.user._id,
    image: { url , filename},
    geometry: coordinates.body.features[0].geometry,
    categories
  });

  await newListing.save();
  req.flash("success", "✅ New Listing Added Successfully!");
  const redirectUrl = res.locals.redirectUrl || `/listings/${newListing._id}`;
  res.redirect(redirectUrl);
  console.log(newListing);
};


// Show a single listing
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  res.render("listings/show", { listing });
};

// Render edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ExpressError(404, "Cannot edit — Listing not found");
  }

  res.render("listings/edit", { listing });
};

// Update listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedListing) {
    throw new ExpressError(404, "Listing not found to update");
  }
  
  if(typeof req.file !== "undefined" ){
  let url = req.file.path  ;
  let filename = req.file.filename ;
  updatedListing.image = { url , filename};
 await updatedListing.save();
  }


  req.flash("success", "✔️ Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};


module.exports.category = async (req, res) => {
  const category = req.query.category;

  if (!category) {
    req.flash("error", "⚠️ Category not provided.");
    return res.redirect("/listings");
  }

  const listings = await Listing.find({
    categories: category   // matches even if listing has multiple categories
  });

  if (listings.length === 0) {
    req.flash("error", `⚠️ No listings found in category: "${category}"`);
    return res.redirect("/listings");
  }

  res.render("listings/index", { allListings: listings });
};



// Delete listing & associated reviews
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found or already deleted");
  }

  await Review.deleteMany({ _id: { $in: listing.reviews } });
  await listing.deleteOne();

  req.flash("success", "🗑️ Listing deleted successfully!");
  res.redirect("/listings");
};

module.exports.searchByCity = async (req, res) => {
  const city = req.query.city;

  const listings = await Listing.find({
    location: { $regex: city, $options: "i" }
  });
  
  if (listings.length === 0) {
    req.flash("error", `⚠️ No listings found in "${city}!`);
    return res.redirect("/listings");
  }
  res.render("listings/index", { allListings: listings });
};


