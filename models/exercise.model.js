const mongoose = require("mongoose");
const userModel = require("./user.model");

const exerciseSchema = new mongoose.Schema({
  description: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel,
    require: true,
  },
});

module.exports = mongoose.model("Exercise", exerciseSchema);
