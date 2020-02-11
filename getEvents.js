const getData = require("./scraper");
const Event = require("./models/Events");

let events = [];

const getEvents = async () => {
  console.log("scraping");
  const moodleEvents = new Promise((resolve, reject) => {
    getData("B00088971", "Barca.290416", events)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
  Promise.all([moodleEvents])
    .then(data => {
      data[0].forEach(async item => {
        const { title, text, qrID, due } = item;
        const existingEvent = await Event.find({ title });

        console.log(existingEvent);

        if (existingEvent.length > 0) {
          existingEvent.forEach(async event => {
            if (title !== event.title) {
              const newEvent = new Event({
                title,
                text,
                qrID,
                due
              });
              await newEvent.save();
              console.log("saved");
            }

            console.log("working");
          });
        } else {
          const newEvent = new Event({
            title,
            text,
            qrID,
            due
          });
          await newEvent.save();
          console.log("saved");
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = getEvents;
