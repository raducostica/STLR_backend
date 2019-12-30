const express = require("express");

const router = express.Router();

const Event = require("../models/Events");

const fs = require("fs");

const uuid = require("uuid/v4");

router.post("/", async (req, res) => {
  const { qrData, username } = req.body;
  try {
    let qr = await Event.findOne({ qrID: qrData });

    if (qr) {
      if (fs.existsSync(`${qr.title}.txt`)) {
        fs.appendFileSync(`${qr.title}.txt`, username);
      } else {
        fs.writeFile(`${qr.title}.txt`, username, err => {
          if (err) throw err;
          console.log("The file has been saved!");
        });
      }
      await Event.findOneAndUpdate(
        { qrID: qrData },
        { $set: { qrID: uuid() } }
      );
      return res.status(201).json({ msg: "success" });
    }

    return res.json({ msg: "Error" });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

module.exports = router;
