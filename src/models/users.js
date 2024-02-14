const mongoose = require("mongoose");

//  TODO: Implementar uma lógica de criptografia de senha
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
  },
  mail: {
    type: String,
    required: true,
    unique: true,
  },
  passwd: {
    type: String,
    required: true,
  },
  seller: {
    type: Boolean,
    required: true,
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

module.exports = mongoose.model("users", userSchema);
