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
  const { qr, username } = req.body;
  // create empty array to store boolean values
  let exists = [];
  try {
    // find event with qrID = qr
    const event = await Event.findOne({ qrID: qr });

    // if present array is not empty, loop through it and check if the username already exists in the present array
    // if it does, add true to the exists array created and return status of 201
    // if not, add false to the exists array
    if (event.present.length > 0) {
      event.present.forEach(async (e) => {
        try {
          if (username !== e) {
            exists.push(false);
          } else {
            exists.push(true);
            return res.status(201).json({ msg: "exists" });
          }
        } catch (error) {
          return res.status(401).json({ msg: "fail" });
        }
      });

      // check if true exists in the exists array, which it should not if the code has gotten this far
      // find the event in the db and add the username to the present array
      if (!exists.includes(true)) {
        await Event.findOneAndUpdate(
          { qrID: qr },
          { $push: { present: username } }
        );
      }

      // return status 201 with success
      return res.status(201).json({ msg: "success" });
    } else {
      // otherwise if the present array is already empty
      // find the event and add the username to the present array
      // return status 201 success
      try {
        await Event.findOneAndUpdate(
          { qrID: qr },
          { $push: { present: username } }
        );

        return res.status(201).json({ msg: "success" });
      } catch (error) {
        // if the try fails, return status 401
        return res.status(401).json({ msg: "fail" });
      }
    }
  } catch (error) {
    return res.status(500).send("server error");
  }
});

module.exports = router;
