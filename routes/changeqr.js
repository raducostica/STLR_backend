const express = require("express");
const router = express.Router();

const uuid = require("uuid/v4");

const Event = require("../models/Events");

router.post("/", async (req, res) => {
  const { qr, state } = req.body;

  try {
    if (state === "true") {
      await Event.findOneAndUpdate(
        { qrID: qr },
        {
          $set: { qrID: uuid() }
        }
      );
      res.status(201).json({ msg: "Success" });
    }

    res.json({ msg: "Fail" });
  } catch (error) {
    res.send("error");
  }
});

module.exports = router;
