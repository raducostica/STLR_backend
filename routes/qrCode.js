const express = require("express");

const router = express.Router();

const Event = require("../models/Events");

const fs = require("fs");

const uuid = require("uuid/v4");

router.post("/", async (req, res) => {
  console.log("trying");
  const { qr, username } = req.body;
  try {
    let qrData = await Event.findOne({ qrID: qr });

    if (qrData) {
      if (fs.existsSync(`${qrData.title}.txt`)) {
        fs.appendFileSync(`${qrData.title}.txt`, username);
      } else {
        fs.writeFile(`${qrData.title}.txt`, username, err => {
          if (err) throw err;
          console.log("The file has been saved!");
        });
      }
      // await Event.findOneAndUpdate(
      //   { qrID: qr },
      //   { $set: { qrID: uuid() } }
      // );
      return res.status(201).json({ msg: "success" });
    }

    // return res.json({ msg: "Error" });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

module.exports = router;
