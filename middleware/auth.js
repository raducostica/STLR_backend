const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // get token from header
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    // split the sent token where there is a space
    // the token comes in the format `Bearer .....token.....`

    const bearer = bearerHeader.split(" ");
    // so we must split at the space and get only the token
    // once split the bearer looks like ["Bearer", "....token....."]

    const bearerToken = bearer[1];
    // we then grab the token, which is at index 1 of the array

    req.token = bearerToken;
    // place the token in the request object so it can be used in the routes
    next();
  } else {
    res.sendStatus(401);
  }
};
