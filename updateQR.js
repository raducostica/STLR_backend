const Event = require("./models/Events");
const uuid = require("uuid/v4");

module.exports = async (old, qr) => {
  try {
    await Event.findOneAndUpdate(
      { qrID: old },
      {
        $set: { qrID: qr },
      }
    );
    console.log("updated");
  } catch (error) {
    console.log("error");
  }
};
