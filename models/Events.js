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
  },
  due: {
    type: String
  }
});

module.exports = mongoose.model("events", EventSchema);
