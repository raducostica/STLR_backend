const express = require("express");

const router = express.Router();

const Event = require("../models/Events");

const jwt = require("jsonwebtoken");

const config = require("config");

const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  // verify the token with the secret
  jwt.verify(req.token, config.get("jwtSecret"), async (err, data) => {
    if (err) {
      res.sendStatus(401);
    } else {
      try {
        // if token is verified
        // get all events from the database
        let event = await Event.find({});

        // return events with a status of 201
        res.status(201).json({ event });
      } catch (error) {
        console.log(error);
        res.status(500).send("server error");
      }
    }
  });
});

router.put("/", async (req, res) => {
  console.log("trying");
  const { qr, username } = req.body;
  try {
    const qrVerify = await Event.findOneAndUpdate(
      { qrID: qr },
      { $push: { present: username } }
    );

    if (!qrVerify) {
      res.status(401).json({ msg: "failure" });
    }

    res.status(201).json({ msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

module.exports = router;
