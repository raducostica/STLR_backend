const express = require("express");
const router = express.Router();
const Event = require("../models/Events");

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
