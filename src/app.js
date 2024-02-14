require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const user = require("./routes/user");
const account = require("./routes/account");

const app = express();
const connectionString = process.env.CONNECTIONSTRING;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", user);
app.use("/account", account);

mongoose.connect(connectionString);

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

app.all("/*", (req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

module.exports = app;
