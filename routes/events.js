const express = require("express");

const router = express.Router();

const login = require("../loginScraper");

const Event = require("../models/Events");

const jwt = require("jsonwebtoken");

const config = require("config");

const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log("logging in");
    const response = await login(username, password);

    if (response) {
      const payload = {
        user: {
          id: username
        }
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) {
            throw err;
          }

          res.status(201).json({ token });
        }
      );
    } else {
      res.status(401).json({ msg: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).send("server error");
  }
});

router.get("/", auth, async (req, res) => {
  jwt.verify(req.token, config.get("jwtSecret"), async (err, data) => {
    if (err) {
      res.sendStatus(401);
    } else {
      try {
        let event = await Event.find({});

        res.status(201).json({ event });
      } catch (error) {
        console.log(error);
        res.status(500).send("server error");
      }
    }
  });
});

module.exports = router;
