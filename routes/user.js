const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

// ============================
// SIGNUP ROUTES
// ============================
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    // Automatically log in after registration
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "User registered successfully!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

// ============================
// LOGIN ROUTES
// ============================
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password",
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect("/listings");
  }
);

// ============================
// LOGOUT ROUTE
// ============================
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
});

module.exports = router;
