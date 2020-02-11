const Event = require("./models/Events");
const uuid = require("uuid/v4");

module.exports = async () => {
  const events = await Event.find({});

  events.forEach(async event => {
    await Event.updateOne(
      { event },
      {
        $set: { qrID: uuid() },
        $currentDate: { lastModified: true }
      }
    );
  });
};
