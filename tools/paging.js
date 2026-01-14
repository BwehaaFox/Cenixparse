const utils = require("./utils");

async function createNewPage(browser_isnt = null, options = {}) {
  const browser = browser_isnt ?? (await puppeteer.launch({ headless: false }));
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, ...options });
  return page;
}

async function openRegions(page) {
  const regionSelector = utils.partClassSelector("Region_region__");
  await page.waitForSelector(regionSelector);
  await utils.sleep(1000);
  await page.click(regionSelector);
}

async function getRegions(page) {
  const regionItemsSelector = `${utils.partClassSelector(
    "UiRegionListBase_root"
  )} ul[role="list"] ${utils.partClassSelector("UiRegionListBase_button__")}`;
  await page.waitForSelector(regionItemsSelector);
  let list = await page.$$(regionItemsSelector);
  list = list.map(async (el) => {
    const text = await el.evaluate((node) => node.innerText.trim());
    return {
      text,
      el,
    };
  });
  list = await Promise.all(list);
  return list;
}

async function selectRegion(page, elem_click) {
  await utils.sleep(1000);
  await elem_click.click();
  await utils.sleep(1000);
  await page.reload({ waitUntil: "networkidle0" });
  await utils.sleep(1000);
}

module.exports = {
  createNewPage,
  openRegions,
  getRegions,
  selectRegion,
};
