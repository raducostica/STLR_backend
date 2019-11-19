const express = require("express");
const getData = require("./scraper");
const app = express();
app.get("/scrape", async (req, res) => {
  console.log("scraping");
  const moodleEvents = new Promise((resolve, reject) => {
    getData(req.query.username, req.query.password)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
  Promise.all([moodleEvents])
    .then(data => {
      res.json({
        info: data
      });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});
app.listen(5000, () => {
  console.log(`started on port`);
});
