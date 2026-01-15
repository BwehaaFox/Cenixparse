const puppeteer = require("puppeteer");
const fs = require("fs");
const paging = require("./tools/paging");
const utils = require("./tools/utils");

const url = process.argv[2];

if (!url) {
  console.log("Использование: node api-parser.js <url>");
  process.exit(1);
}

async function getProducts(urlStr, page) {
  const dataUrl = utils.parseUrl(urlStr);
  await utils.sleep(2000);
  const products = await page.evaluate(async (dataUrl) => {
    const response = await fetch(
      `https://www.vprok.ru/web/api/v1/catalog/category/${dataUrl.id}?sort=popularity_desc&limit=30`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          noRedirect: true,
          url: dataUrl.fullPath,
        }),
      }
    );

    if (!response.ok) throw new Error(`Ошибка API: ${response.status}`);

    const json = await response.json();
    return json.products;
  }, dataUrl);
  return products;
}

(async () => {
  browser = await puppeteer.launch({ headless: true });
  try {
    page = await paging.createNewPage(browser);
    await page.goto(url, { waitUntil: "networkidle0" });

    const products = await getProducts(url, page);
    const origin = new URL(url).origin;
    const content = products
      .map((p) => utils.formatProductCard(p, origin))
      .join("\n\n");

    fs.writeFileSync("products-api.txt", content);
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    await browser.close();
  }
})();
