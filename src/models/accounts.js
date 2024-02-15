const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("accounts", AccountSchema);
