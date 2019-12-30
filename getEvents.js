const mongoose = require("mongoose");

const Event = require("./models/Events");
const getData = require("./scraper");

const getEvents = async () => {
  console.log("scraping");
  const moodleEvents = new Promise((resolve, reject) => {
    getData("B00088971", "Barca.290416")
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
        const { title, text, qrID } = item;
        const existingEvent = await Event.find({ title });

        if (existingEvent.length > 0) {
          existingEvent.forEach(async event => {
            if (title !== event.title) {
              const newEvent = new Event({
                title,
                text,
                qrID
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
            qrID
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
