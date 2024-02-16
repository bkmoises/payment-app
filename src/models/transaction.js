const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  payer: {
    type: String,
    required: true,
  },
  payee: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  reverted: {
    type: Boolean,
    required: false,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("transactions", transactionSchema);
