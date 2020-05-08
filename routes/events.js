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
    console.log(qr, username);
    const event = await Event.findOne({ qrID: qr });
    console.log(event);

    if (event.present.length > 0) {
      event.present.forEach(async (e) => {
        try {
          if (username !== e) {
            await Event.findOneAndUpdate(
              { qrID: qr },
              { $push: { present: username } }
            );
          } else {
            return res.status(201).json({ msg: "exists" });
          }

          return res.status(201).json({ msg: "success" });
        } catch (error) {
          return res.status(401).json({ msg: "fail" });
        }
      });
    } else {
      try {
        await Event.findOneAndUpdate(
          { qrID: qr },
          { $push: { present: username } }
        );

        return res.status(201).json({ msg: "success" });
      } catch (error) {
        return res.status(401).json({ msg: "fail" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("server error");
  }
});

module.exports = router;
