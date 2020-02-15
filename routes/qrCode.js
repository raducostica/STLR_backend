const express = require("express");

const router = express.Router();

const Event = require("../models/Events");

const fs = require("fs");

const uuid = require("uuid/v4");
router.post("/", async (req, res) => {
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
    let event = await Event.findOneAndUpdate(
      { qrID: qr },
      { $push: { present: username } }
    );

    res.json(event);

    // if (qrData) {
    //   if (fs.existsSync(`${qrData.title}.txt`)) {
    //     fs.appendFileSync(`${qrData.title}.txt`, username);
    //   } else {
    //     fs.writeFile(`${qrData.title}.txt`, username, err => {
    //       if (err) throw err;
    //       console.log("The file has been saved!");
    //     });
    //   }
    //   return res.status(201).json({ msg: "success" });
    // }

    // return res.json({ msg: "Error" });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

module.exports = router;
