require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const userRouter = require("./routes/user");
const accountRoutes = require("./routes/account");
const transactionRoutes = require("./routes/transaction");

const app = express();
const connectionString = process.env.CONNECTIONSTRING;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas
app.use("/user", userRouter);
app.use("/account", accountRoutes);
app.use("/transaction", transactionRoutes);

// Conexão com o banco de dados
mongoose.connect(connectionString);

// Rota padrão
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

// Rota para tratamento de rotas não configuradas
app.all("/*", (_req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

module.exports = app;
