const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userModel = require("./models/user.model");
const bodyParser = require("body-parser");
const exerciseModel = require("./models/exercise.model");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URI).then((rs) => {
  console.log(`DB connection ${rs.connection.host}`);
});

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  const username = req.body.username;
  const user = await userModel.create({ username });
  res.json(user);
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const userId = req.params._id;
  const input = req.body;
  if (!input.date) input.date = new Date();
  else input.date = new Date(input.date);

  input.date = input.date.toDateString();

  const exercise = await exerciseModel.create({ ...input, user: userId });
  const user = await userModel.findById(userId);
  res.json({
    _id: user._id,
    date: exercise.date,
    duration: exercise.duration,
    description: exercise.description,
    username: user.username,
  });
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const user = await userModel.findById(req.params._id);
  let log = await exerciseModel.find({ user: req.params._id });
  const count = log.length;

  if (req.query.from && req.query.to)
    log = log.filter((x) => {
      const date = new Date(x.date);
      const from = new Date(req.query.from);
      const to = new Date(req.query.to);
      if (date > from && date < to) return true;
    });
  if (req.query.limit) log = log.slice(0, req.query.limit);

  res.json({ username: user.username, _id: user._id, count, log });
});

app.get("/api/users", async (req, res) => {
  const users = await userModel.find();
  res.json(users);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
