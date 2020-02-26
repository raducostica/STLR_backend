const express = require("express");
const json2csv = require("json2csv").parse;

const router = express.Router();

const Event = require("../models/Events");

const fs = require("fs");

router.put("/", async (req, res) => {
  console.log("trying");
  const { qr, username } = req.body;
  try {
    const time = () => {
      let today = new Date();
      let mm = String(today.getMonth()).padStart(2, "0");
      let dd = String(today.getDate()).padStart(2, "0");
      let yy = String(today.getFullYear());

      let hours = String(today.getHours());
      let mins = String(today.getMinutes());
      let todaysDate = new Date(yy, mm, dd, hours, mins);

      return todaysDate.toISOString();
    };

    // const qrVerify = await Event.findOne({ qrID: qr });

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
