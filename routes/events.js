const express = require("express");

const router = express.Router();

const login = require("../loginScraper");

const Event = require("../models/Events");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log("logging in");
    const response = await login(username, password);

    if (response === "Good") {
      res.status(201).json({ msg: "Success" });
    } else {
      res.json({ msg: "Fail" });
    }
  } catch (error) {
    res.status(500).send("server error");
  }
});

router.get("/", async (req, res) => {
  try {
    let event = await Event.find({});

    res.status(201).json(event);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
