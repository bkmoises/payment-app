const mongoose = require("mongoose");

const User = mongoose.Schema({
  name: String,
  cpf: String,
  mail: String,
  passwd: String,
  seller: Boolean,
});

module.exports = mongoose.model("users", User);
