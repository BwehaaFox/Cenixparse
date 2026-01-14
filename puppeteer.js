const puppeteer = require("puppeteer");
const fs = require("fs");
const paging = require("./tools/paging");
const collect = require("./tools/collect");

const url = process.argv[2];
const region = process.argv[3];

if (!url || !region) {
  console.log("Использование: node puppeteer.js <url> <region>");
  process.exit(1);
}

(async () => {
  browser = await puppeteer.launch({ headless: false });
  try {
    page = await paging.createNewPage(browser);
    await page.goto(url, { waitUntil: "networkidle0" });
    await paging.openRegions(page);
    const regions = await paging.getRegions(page);
    const target_region = regions.find((reg) => reg.text == region);

    if (!target_region) {
      console.log(`Регион "${region} не найден"`);
      process.exit(1);
    }

    await paging.selectRegion(page, target_region.el);
    const prices = await collect.price(page);
    const stats = await collect.rate(page);
    const summary = { ...prices, ...stats };
    const content = Object.keys(summary)
      .map((k) => `${k}=${summary[k]}`)
      .join("\n");

    fs.writeFileSync("product.txt", content);
    await page.screenshot({ path: "screenshot.jpg", fullPage: true });
    process.exit(1);
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    await browser.close();
  }
})();
