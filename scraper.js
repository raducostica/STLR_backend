const puppeteer = require("puppeteer");

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
  await page2.goto("https://moodle.itb.ie/course/view.php?id=1774&section=2");

  await page2.screenshot({ path: "2.png" });

  const data = await page2.evaluate(() => {
    const text = document.querySelector(".sectionname span").innerHTML;
    return text;
  });

  await browser.close();

  return data;
};

// const logOut = async () => {
//   let browser = await puppeteer.launch();
//   let page = await browser.newPage();
//   await page.goto("https://moodle.itb.ie/course/view.php?id=1774&section=2");
//   await page.hover(`a[data-toggle="dropdown"]`);
//   await page.waitFor(5000);
//   await page.screenshot({ path: "8.png" });
//   // const element = await page.$(`[dropdown-menu]`);
//   // await page.waitFor(50);
// };

module.exports = getData;
