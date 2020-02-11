const express = require("express");
const app = express();

const updateQR = require("./updateQrCode");

// get data in background
const getEvents = require("./getEvents");

const getData = require("./scraper");

// connect mongodb database
const connectDB = require("./config/db");

connectDB();

// allow for use of req.body
app.use(express.json({ extended: false }));

app.use("/scrape", require("./routes/events"));
app.use("/qrcode", require("./routes/qrCode"));
app.use("/changeqr", require("./routes/changeqr"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`started on port ${PORT}`);
  // getEvents();
  // setInterval(getEvents, 120000);
  // setInterval(updateQR, 6000);
  // 3600000);
});
