const Event = require("./models/Events");
const uuid = require("uuid/v4");

module.exports = async qr => {
  await Event.findOneAndUpdate(
    { qrID: qr },
    {
      $set: { qrID: uuid() }
    }
  );
  console.log("updated");
};
