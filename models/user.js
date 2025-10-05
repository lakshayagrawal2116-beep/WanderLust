const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true // ✅ good idea to make email unique
  }
});

// ✅ FIX: Use userSchema, not user
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
