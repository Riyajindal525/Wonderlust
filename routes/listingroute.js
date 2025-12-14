const express = require("express");
const router = express.Router();
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listing");
const { storage } = require("../cloudconfig.js");

const multer = require("multer");
const upload = multer({ storage }); // Configure multer for file uploads
//  Listings 

// Show all listings & Create new listing
router
  .route("/")
  .get(wrapAsync(listingController.index)) 
  .post(isLoggedIn,  upload.single("image.url"), wrapAsync(listingController.createListing));

// New listing form (sync, separate route)
router.get("/new", isLoggedIn, saveRedirectUrl, listingController.renderNewForm);

router
  .route("/categories")
  .get(wrapAsync(listingController.category));

  // Edit listing form (sync, separate route)
router.get("/:id/edit", isLoggedIn, saveRedirectUrl, wrapAsync(listingController.renderEditForm));

// Search listings by city
router
 .route("/search/city")
 .get(wrapAsync(listingController.searchByCity));

// Show, Update, Delete a single listing
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, saveRedirectUrl,upload.single("image.url"), wrapAsync(listingController.updateListing)) 
  .delete(isLoggedIn, saveRedirectUrl,  wrapAsync(listingController.deleteListing)); 


module.exports = router;
