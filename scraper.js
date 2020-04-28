const puppeteer = require("puppeteer");
const uuid = require("uuid/v4");

const getData = async (username, password, events) => {
  console.log("getting data");
  let url = "https://moodle.itb.ie/login/index.php";

  let browser = await puppeteer.launch();

  let page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on("request", (request) => {
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

  await page.goto("https://moodle.itb.ie/");

  const adminLecturers = await page.evaluate(() => {
    const stlrCourse = document.querySelectorAll(".coursebox.clearfix");

    const stlrCourseArray = Array.from(stlrCourse);

    let stlrCourseText = stlrCourseArray.find((course) =>
      course.innerText.includes("STLR")
    ).innerText;

    const stlrArr = stlrCourseText.split("Lecturer: ");
    const stlrResult = stlrArr.map((i) => i.replace(/\n|\r/g, ""));

    return stlrResult;
  });

  const page2 = await browser.newPage();

  await page2.setRequestInterception(true);
  await page2.setCookie(...cookies);
  page2.on("request", (request) => {
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
      let eventData = eventArray.slice(1).map((event) => {
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

    if (i.text) {
      await page3.goto(i.text);
      const info = await page3.evaluate(() => {
        // const event = document.querySelectorAll(".lastcol");
        // let eventArray = Array.from(event);
        // console.log(eventArray[3].innerText);
        // return eventArray[3].innerText;
        let oTable = document.querySelector(".generaltable");
        let data = [...oTable.rows].map((t) =>
          [...t.children].map((u) => u.innerText)
        );

        return data.find((item) => {
          if (item[0].includes("Due")) {
            return item[0];
          }
        });
      });

      let dueDate = new Date();
      let dateStatus = "";

      if (info !== undefined) {
        dueDate = changeDate(info[1]);
        dateStatus = checkStatus(dueDate);
        i.qrID = uuid();
        i.due = dueDate;
        i.status = dateStatus;
      } else {
        i.qrID = uuid();
        i.status = "current";
      }

      const found = events.some((el) => el.title === i.title);

      if (!found) {
        events.push(i);
      }
    } else {
      const found = events.some((el) => el.title === i.title);
      i.qrID = uuid();
      i.status = "current";

      if (!found) {
        events.push(i);
      }
    }
  }

  await browser.close();
  return [events, adminLecturers];
};

const changeDate = (str) => {
  let newStr = str.split(",");

  newStr = newStr.splice(1);

  for (let i in newStr) {
    newStr[i] = newStr[i].trim();
  }

  let odate = newStr[0].split(" ");

  let time = newStr[1].split(" ");

  if (!time[0].includes(":")) {
    time[0] += ":00";
  }
  let hoursMins = time[0].split(":");

  if (time[1] === "AM" && hoursMins[0] == 12) {
    let x = Number(hoursMins[0]);
    let newhrs = x - 12;
    hoursMins[0] = newhrs.toString();
  } else if (time[1] === "PM" && hoursMins[0] < 12) {
    let x = Number(hoursMins[0]);
    let newhrs = x + 12;
    hoursMins[0] = newhrs.toString();
  }

  let date;
  date = new Date(odate[1] + " " + odate[0] + "," + odate[2]);
  date.setHours(hoursMins[0], hoursMins[1], 0);

  return date;
};

const checkStatus = (date) => {
  let today = new Date();
  let mm = String(today.getMonth()).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let yy = String(today.getFullYear());

  let hours = String(today.getHours());
  let mins = String(today.getMinutes());
  let todaysDate = new Date(yy, mm, dd, hours, mins);

  if (+todaysDate >= +date) {
    return "expired";
  }

  return "current";
};

module.exports = getData;
