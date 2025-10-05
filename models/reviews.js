const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true }
});

module.exports = mongoose.model("Review", reviewSchema);
