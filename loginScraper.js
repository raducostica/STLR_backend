const puppeteer = require("puppeteer");
const uuid = require("uuid/v4");

const login = async (username, password) => {
  console.log("logging in user");
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

  await page.screenshot({ path: "3.png" });

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

  const data = await page2.evaluate(() => {
    const user = document.querySelector(".usermendrop");

    if (!user) {
      return false;
    }

    return true;
  });

  await page2.screenshot({ path: "4.png" });
  browser.close();

  if (data) {
    return true;
  }

  return false;
};

module.exports = login;
