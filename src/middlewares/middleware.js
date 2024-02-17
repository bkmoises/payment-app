const axios = require("axios");

const autorizationVerify = async (_req, res, next) => {
  const response = await axios.get(
    "https://run.mocky.io/v3/5794d450-d2e2-4412-8131-73d0293ac1cc",
  );

  if (response.data.message === "Autorizado") {
    next();
  } else {
    return res.status(400).json({ error: "Transação não autorizada" });
  }
};

module.exports = autorizationVerify;
