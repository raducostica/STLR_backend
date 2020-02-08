const puppeteer = require("puppeteer");
const uuid = require("uuid/v4");

let events = [];
const getData = async (username, password) => {
  console.log("working");
  let url = "https://moodle.itb.ie/login/index.php";

  let browser = await puppeteer.launch();

  let page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on("request", request => {
    if (["image", "stylesheet", "font"].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.goto(url);

  await page.type(`[name=username]`, username);

  await page.type(`[name=password]`, password);

  await page.screenshot({ path: "1.png" });

  await page.click(`input[id="loginbtn"]`);

  const cookies = await page.cookies();

  await page.waitFor(5000);

  const page2 = await browser.newPage();

  await page2.setRequestInterception(true);
  await page2.setCookie(...cookies);
  page2.on("request", request => {
    if (["image", "stylesheet", "font"].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });
  await page2.goto("https://moodle.itb.ie/course/view.php?id=1774&section=11");

  await page2.screenshot({ path: "2.png" });

  const data = await page2.evaluate(() => {
    const eventsList = document.querySelectorAll(".activityinstance");

    const eventArray = Array.from(eventsList);

    if (eventArray.length !== 0) {
      let eventData = eventArray.slice(1).map(event => {
        let singleEvent = {};
        singleEvent.title = event.textContent;
        singleEvent.text = event.lastElementChild.href;
        return singleEvent;
      });

      return eventData;
    }
  });

  for (let i of data) {
    const page3 = await browser.newPage();
    const found = events.some(el => el.title === i.title);

    if (i.text) {
      await page3.goto(i.text);
      const info = await page3.evaluate(() => {
        const event = document.querySelectorAll(".lastcol");

        let eventArray = Array.from(event);

        return eventArray[3].innerText;
      });
      if (!found) {
        i.qrID = uuid();
        i.due = info;
        events.push(i);
      }
    } else {
      if (!found) {
        i.qrID = uuid();
        events.push(i);
      }
    }
  }

  // data.forEach(i => {
  //   const found = events.some(el => el.title === i.title);

  //   if (!found) {
  //     i.qrID = uuid();
  //     events.push(i);
  //   }
  // });

  await browser.close();
  return events;
};

const moodleEvents = new Promise((resolve, reject) => {
  getData("B00088971", "Barca.290416")
    .then(data => {
      resolve(data);
    })
    .catch(err => {
      reject(err);
    });
});

Promise.all([moodleEvents]).then(data => {
  console.log(data);
});

module.exports = getData;
