require("dotenv").config();
const axios = require("axios");

const { AUTH_PORT } = process.env;
const URI = `http://localhost:${AUTH_PORT}/authorization`;

const authorizationVerify = async (_req, res, next) => {
  const response = await axios.get(URI);

  if (response.data.status === "Authorized") return next();
  return res.status(400).json({ error: "Transação não autorizada" });
};

module.exports = authorizationVerify;
