if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
app.set('case sensitive routing', true);
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");

const listingRouter = require("./routes/listingroute.js");
const reviewRouter = require("./routes/reviewroute.js");
const userRouter = require("./routes/userRoute.js");

// DATABASE CONNECTION
mongoose.connect(process.env.ATLASDB_URL)
  .then(() => console.log("Connected to MONGO DB!"))
  .catch(err => console.log(`Error connecting MongoDB: ${err}`));

// VIEW ENGINE & STATIC
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// SESSION STORE FIX
const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  secret: process.env.SECRET,
  touchAfter: 24 * 3600,
});

store.on("error", (err) => console.log("SESSION STORE ERROR:", err));

const sessionoptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};

app.use(session(sessionoptions));
app.use(flash());

const blockLogin = (req, res, next) => {
    if (req.method === "GET" || req.method === "POST") {
        return next(new ExpressError(403, "Login is temporarily disabled!"));
    }
    next();
};

// PASSPORT INIT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FLASH GLOBALS
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ROUTES
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Hello! I am home route");
});

// PAGE NOT FOUND
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// ERROR HANDLER FIX
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  console.log("ERROR:", err);
  return res.status(statusCode).render("listings/error", { err });
});

app.listen(8080, () => {
  console.log("App is running at http://localhost:8080");
});
