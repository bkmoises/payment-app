const express = require("express");
// const mongoose = require("mongoose");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

app.post("/user", (req, res) => {
  const user = req.body;
  return res.status(201).json(user);
});

app.get("/user", (_req, res) => {
  const user = [
    {
      userId: "1",
      name: "user-1",
      cpf: "123.456.789-10",
      mail: "mail@mail.com",
      passwd: "12345",
      seller: true,
    },
  ];

  return res.status(200).json(user);
});

app.put("/user/:id", (req, res) => {
  const user = {
    userId: "1",
    name: "user-1",
    cpf: "123.456.789-10",
    mail: "mail@mail.com",
    passwd: "12345",
    seller: true,
  };

  user.name = req.body.name;
  user.passwd = req.body.passwd;

  return res.status(200).json(user);
});

app.delete("/user/:id", (req, res) => {
  return res.status(204).json();
});

module.exports = app;
