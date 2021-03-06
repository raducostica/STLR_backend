const getData = require("./scraper");
const Event = require("./models/Events");
const Lecturer = require("./models/Lecturers");

let events = [];

const getEvents = async () => {
  console.log("getting events");
  const moodleEvents = new Promise((resolve, reject) => {
    getData("username", "password", events)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
  Promise.all([moodleEvents])
    .then((data) => {
      const lecturers = data[0][1];
      lecturers.shift();
      console.log(lecturers);

      lecturers.forEach(async (item) => {
        const existingLecturer = await Lecturer.find({ name: item });

        if (existingLecturer.length === 0) {
          const newLecturer = new Lecturer({
            name: item.toLowerCase(),
          });
          await newLecturer.save();
          console.log("lecturer saved");
        } else {
          existingLecturer.forEach(async (lecturer) => {
            if (item !== lecturer.name) {
              const newLecturer = new Lecturer({
                name: item.toLowerCase(),
              });
              await newLecturer.save();
              console.log("lecturer saved");
            }
          });
        }
      });
      data[0][0].forEach(async (item) => {
        const { title, text, qrID, due, status } = item;
        const existingEvent = await Event.find({ title });

        if (existingEvent.length > 0) {
          console.log("exists");
          existingEvent.forEach(async (event) => {
            if (title !== event.title) {
              const newEvent = new Event({
                title,
                text,
                qrID,
                due,
                status,
              });
              await newEvent.save();
              console.log("saved");
            } else {
              if (status !== event.status) {
                console.log(status, event.status);
                await Event.findOneAndUpdate(
                  { title },
                  {
                    $set: { status },
                  }
                );
                console.log("modified status of existing event");
              }
            }

            console.log("getEvents working");
          });
        } else {
          const newEvent = new Event({
            title,
            text,
            qrID,
            due,
            status,
          });
          await newEvent.save();
          console.log("saved");
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = getEvents;
