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
  const user = req.params._id;
  const exercise = await (
    await exerciseModel.create({ ...req.body, user })
  ).populate("user");
  res.json(exercise);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
