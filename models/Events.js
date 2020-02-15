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
  },
  status: {
    type: String,
    required: true
  },
  present: [
    {
      type: String
    }
  ]
});

module.exports = mongoose.model("events", EventSchema);
