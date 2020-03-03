const express = require("express");
const router = express.Router();
const Lecturer = require("../models/Lecturers");

router.get("/", async (req, res) => {
  try {
    let lecturerProjection = {
      __v: false,
      _id: false
    };
    let lecturers = await Lecturer.find({}, lecturerProjection);

    res.status(201).json({ lecturers });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
