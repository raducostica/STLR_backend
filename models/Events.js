const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  qrID: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("events", EventSchema);
