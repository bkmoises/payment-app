const express = require("express");
// const mongoose = require("mongoose");
const app = express();
const user = require("./routes/user");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", user);

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

module.exports = app;
