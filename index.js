const express = require("express");
const app = express();

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`started on port ${PORT}`);
  getData();
  // getEvents();
  // setInterval(recieveDate, 3600000);
});
