const mongoose = require("mongoose");

const LecturerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("lecturers", LecturerSchema);
