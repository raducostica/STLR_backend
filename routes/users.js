const express = require("express");

const router = express.Router();

const login = require("../loginScraper");

const User = require("../models/Users");

const Lecturer = require("../models/Lecturers");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require("config");

// router.post("/", async (req, res) => {
//   console.log(req.headers["user-agent"]);
//   const { username, password } = req.body;
//   try {
//     console.log("logging in");
//     const response = await login(username, password);

//     if (response) {
//       const payload = {
//         user: {
//           id: username
//         }
//       };
//       jwt.sign(
//         payload,
//         config.get("jwtSecret"),
//         {
//           expiresIn: 360000
//         },
//         (err, token) => {
//           if (err) {
//             throw err;
//           }

//           res.status(201).json({ token });
//         }
//       );
//     } else {
//       res.status(401).json({ msg: "Invalid Credentials" });
//     }
//   } catch (error) {
//     res.status(500).send("server error");
//   }
// });

router.post("/lect", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await Lecturer.findOne({ name: username });

    user = user.toLowerCase();

    if (!user) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const response = await login(username, password);

    if (!response) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: username,
      },
    };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) {
          throw err;
        }

        return res.status(201).json({ token });
      }
    );
  } catch (error) {
    res.status(500).send("server error");
  }
});

router.post("/", async (req, res) => {
  const { username, password, width, height, brand, model } = req.body;
  const userAgent = req.headers["user-agent"];
  try {
    const user = await User.findOne({ username });

    if (!user) {
      console.log("logging in");
      const response = await login(username, password);

      if (!response) {
        return res.status(401).json({ msg: "Invalid Credentials" });
      }

      const newUser = new User({
        username,
        password,
        width,
        height,
        brand,
        model,
      });

      const salt = await bcrypt.genSaltSync(10);

      newUser.password = await bcrypt.hash(password, salt);

      await newUser.save();

      console.log(newUser);

      const payload = {
        user: {
          id: username,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) {
            throw err;
          }

          res.status(201).json({ token });
        }
      );

      return;
    }

    console.log("checking user saved");
    const isMatch = await bcrypt.compare(password, user.password);
    let isWidthMatch = width === user.width ? true : false;
    let isHeightMatch = height === user.height ? true : false;
    let isModelMatch = model === user.model ? true : false;
    let isBrandMatch = brand === user.brand ? true : false;

    if (
      !isMatch ||
      !isWidthMatch ||
      !isHeightMatch ||
      !isModelMatch ||
      !isBrandMatch
    ) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: username,
      },
    };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) {
          throw err;
        }

        res.status(201).json({ token });
      }
    );
  } catch (error) {
    res.status(500).send("server error");
  }
});

module.exports = router;
