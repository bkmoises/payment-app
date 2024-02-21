const axios = require("axios");

// TODO: Criar uma API para emular o sistema de autoriação
const autorizationVerify = async (_req, res, next) => {
  const response = await axios.get("https://www.google.com");

  if (response.status === 200) return next();
  return res.status(400).json({ error: "Transação não autorizada" });
};

module.exports = autorizationVerify;
