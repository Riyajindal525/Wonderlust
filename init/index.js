const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config();


mongoose.connect("mongodb+srv://ritikjindal970_db_user:Riya%4012%4034%405@cluster0.ewybt7d.mongodb.net/wonderlust?retryWrites=true&w=majority")
  .then(() => console.log("Connected to MONGO DB!"))
  .catch(err => console.log(`Error: ${err}`));

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Old data deleted ✅");

    const allowedCategories = [
      'Trending',
      'Farms',
      'Rooms',
      'Mountains',
      'Cities',
      'Beach',
      'Cabins',
      'Lakeside'
    ];


    // Coordinates
    const indianCoords = [
      [72.8777, 19.0760], // Mumbai
      [77.1025, 28.7041], // Delhi
      [88.3639, 22.5726], // Kolkata
      [80.2707, 13.0827], // Chennai
      [78.4867, 17.3850], // Hyderabad
      [73.8567, 18.5204], // Pune
      [76.7794, 30.7333], // Chandigarh
      [75.8577, 30.9000], // Ludhiana
      [77.5946, 12.9716], // Bengaluru
      [75.7139, 26.9124], // Jaipur
    ];

    const getRandomCategories = () => {
      const shuffled = allowedCategories.sort(() => 0.5 - Math.random());
      const count = Math.random() < 0.7 ? 1 : 2;
      return shuffled.slice(0, count);
    };

    // Add owner, geometry, and categories
    initData.data = initData.data.map((listing, index) => ({
      ...listing,
      owner: "6926fe08e287c50a81532539",
      geometry: {
        type: "Point",
        coordinates: indianCoords[index % indianCoords.length],
      },
      categories: getRandomCategories(),
    }));

    await Listing.insertMany(initData.data);
    console.log("Data was initialized with geometry & categories ✅");

    mongoose.connection.close();
  } catch (err) {
    console.error("Error in initDB:", err);
  }
};

initDB();
