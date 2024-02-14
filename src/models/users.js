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
});

module.exports = mongoose.model("users", userSchema);
