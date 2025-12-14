const mongoose = require("mongoose"); 
const Review = require('./Review.js');
const Schema = mongoose.Schema;

const listSchema = new Schema({
  title: {
    type: String,
    // required: true
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },

  // ✅ Move reviews outside of image
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  categories: {
    type: [String],   // Array of strings
    enum: [
      'Trending',
      'Farms',
      'Rooms',
      'Mountains',
      'Cities',
      'Beach',
      'Cabins',
      'Lakeside',
      'Views'
    ]
  }
});

listSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    const result = await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listSchema);
