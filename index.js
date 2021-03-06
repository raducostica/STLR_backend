const express = require("express");
const app = express();

var server = require("http").createServer(app);
var io = require("socket.io")(server);

const PORT = process.env.PORT || 5000;

const updateQR = require("./updateQR");

// get data in background
const getEvents = require("./getEvents");

// connect mongodb database
const connectDB = require("./config/db");

connectDB();

// allow for use of req.body
app.use(express.json({ extended: false }));

app.use("/stlr/users", require("./routes/users"));
app.use("/stlr/events", require("./routes/events"));
app.use("/stlr/lecturer", require("./routes/lecturer"));

server.listen(PORT, () => {
  console.log(`listening on port${PORT}`);
  getEvents();
  // setInterval(getEvents, 360000);
});

io.on("connection", function (client) {
  console.log("Client connected...");

  client.on("qr", (qr) => {
    console.log(qr);
    updateQR(qr.qrCode_id, qr.newQRID);
    client.emit("done", qr.newQRID);
  });
});
