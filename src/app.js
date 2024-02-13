require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const user = require("./routes/user");

const app = express();
const connectionString = process.env.CONNECTIONSTRING;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", user);

try {
  mongoose.connect(connectionString);
} catch (err) {
  process.exit(1);
}

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

module.exports = app;
