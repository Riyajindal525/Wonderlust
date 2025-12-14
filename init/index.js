const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/User.js"); // ✅ Add User import
require("dotenv").config();

mongoose.connect("mongodb+srv://ritikjindal970_db_user:Riya%4012%4034%405@cluster0.ewybt7d.mongodb.net/wonderlust?retryWrites=true&w=majority") // ✅ fix typo URl -> URL
  .then(() => console.log("Connected to MONGO DB!"))
  .catch(err => console.log(`Error: ${err}`));

const initDB = async () => {
  try {
    // 1️⃣ Delete old listings
    await Listing.deleteMany({});
    console.log("Old data deleted ✅");

    // 2️⃣ Create/fetch owner
    let owner = await User.findOne({ username: "Riya Jindal" });
    if (!owner) {
      owner = new User({ username: "Riya Jindal", email: "riya@example.com" });
      await owner.setPassword("password123");
      await owner.save();
      console.log("Owner user created ✅");
    }

    // 3️⃣ Define allowed categories & coordinates
    const allowedCategories = [
      'Trending', 'Farms', 'Rooms', 'Mountains', 'Cities', 'Beach', 'Cabins', 'Lakeside'
    ];

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

    // 4️⃣ Map initData & assign owner, geometry, categories
    const listingsWithOwner = initData.data.map((listing, index) => ({
      ...listing,
      owner: owner._id,
      geometry: { type: "Point", coordinates: indianCoords[index % indianCoords.length] },
      categories: getRandomCategories(),
    }));

    // 5️⃣ Insert all listings
    await Listing.insertMany(listingsWithOwner);
    console.log("Data initialized with owner, geometry & categories ✅");

  } catch (err) {
    console.error("Error in initDB:", err);
  } finally {
    mongoose.connection.close();
  }
};

initDB();
