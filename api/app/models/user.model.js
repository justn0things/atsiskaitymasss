const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
  })
);

module.exports = User;
