const utils = require("./utils");
const partClassSelector = utils.partClassSelector;

async function price(page) {
  const selectors = {
    discount: partClassSelector("Price_role_discount__"),
    old: partClassSelector("Price_role_old__"),
    regular: partClassSelector("Price_role_regular__"),
    block: partClassSelector("ProductPage_informationBlock__"),
  };
  await page.waitForSelector(selectors.block, {
    timeout: 5000,
  });

  return await page.evaluate((s) => {
    const getTxt = (sel) =>
      document
        .querySelector(sel)
        ?.innerText.replace(/[^\d.,]/g, "")
        .replace(",", ".") || null;

    const price_discount = getTxt(`${s.block} ${s.discount}`);
    const price_old = getTxt(`${s.block} ${s.old}`);
    const price_regular = getTxt(`${s.block} ${s.regular}`);

    return {
      price: price_regular ?? price_discount,
      priceOld: price_old,
    };
  }, selectors);
}

async function rate(page) {
  const block = partClassSelector("Summary_section__");
  await page.waitForSelector(block, {
    timeout: 5000,
  });
  const rate = await page.$eval(
    `${block} meta[itemprop="ratingValue"]`,
    (el) => el.content
  );
  const review = await page.$eval(
    `${block} meta[itemprop="reviewCount"]`,
    (el) => el.content
  );
  return {
    rate,
    review,
  };
}

module.exports = {
  price,
  rate,
};
