const puppeteer = require("puppeteer");
const uuid = require("uuid/v4");

let events = [];
const getData = async (username, password) => {
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
  await page2.goto("https://moodle.itb.ie/course/view.php?id=1774&section=10");

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

  data.forEach(i => {
    const found = events.some(el => el.title === i.title);

    if (!found) {
      i.qrID = uuid();
      events.push(i);
    }
  });

  await browser.close();
  return events;
};

module.exports = getData;