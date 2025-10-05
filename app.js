const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Listing = require("./models/listing");
const Review = require("./models/reviews");
const User = require("./models/user");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");

// -------------------
// Database
// -------------------
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust1";
mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ Connected to DB"))
  .catch(err => console.log(err));

// -------------------
// App Setup
// -------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// -------------------
// Session & Flash
// -------------------
const sessionConfig = {
  secret: "supersecretcode",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
};
app.use(session(sessionConfig));
app.use(flash());

// -------------------
// Passport Setup
// -------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -------------------
// Middleware to make user & flash available in EJS
// -------------------
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// -------------------
// Helper Middleware
// -------------------
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

// -------------------
// ROUTES
// -------------------

// Home
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// -------------------
// User Routes
// -------------------
app.get("/signup", (req, res) => {
  res.render("users/signup");
});

app.post("/signup", wrapAsync(async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email });
  const registeredUser = await User.register(newUser, password);
  req.login(registeredUser, err => {
    if (err) return next(err);
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
  });
}));

app.get("/login", (req, res) => {
  res.render("users/login");
});

app.post("/login",
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  (req, res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    res.redirect("/listings");
  }
);

app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
});

// -------------------
// Listings Routes
// -------------------

// Index
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// New Listing Form
app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

// Create Listing
app.post("/listings", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success", "Listing created successfully!");
  res.redirect("/listings");
}));

// Show Listing
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
}));

// Edit Listing Form
app.get("/listings/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
}));

// Update Listing
app.put("/listings/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${req.params.id}`);
}));

// Delete Listing
app.delete("/listings/:id", isLoggedIn, wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
}));

// -------------------
// Reviews Routes
// -------------------

// Add Review
app.post("/listings/:id/reviews", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  const newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${req.params.id}`);
}));

// Delete Review
app.delete("/listings/:id/reviews/:reviewId", isLoggedIn, wrapAsync(async (req, res) => {
  await Review.findByIdAndDelete(req.params.reviewId);
  await Listing.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } });
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${req.params.id}`);
}));

// -------------------
// Error Handler
// -------------------
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  console.error(err);
  res.status(statusCode).send(message);
});

// -------------------
// Start Server
// -------------------
app.listen(8080, () => {
  console.log("🚀 Server running on http://localhost:8080");
});
