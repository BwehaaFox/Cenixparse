/**
 * Враппер для поиска по части класса
 * @param {string} className
 * @returns string
 */
function partClassSelector(className) {
  return `[class*="${className}"]`;
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function parseUrl(urlStr) {
  try {
    const url = new URL(urlStr);
    const pathParts = url.pathname.split("/").filter(Boolean);

    return {
      fullPath: url.pathname,
      id: pathParts[1], // '7382'
      slug: pathParts[2], // 'pomidory-i-ovoschnye-nabory'
      category: pathParts[0], // 'catalog'
    };
  } catch (error) {
    return { error: "Некорректный URL", mes: error };
  }
}

function formatProductCard(product, origin) {
  const addLn = (name, val) => `${name}:${val}\n`;
  let data = "";
  data += addLn("Название товара", product.name);
  data += addLn("Ссылка на страницу товара", `${origin}${product.url}`);
  data += addLn("Рейтинг", product.rating);
  data += addLn("Количество отзывов", product.reviews);
  data += addLn("Цена", product.price);

  if (product.oldPrice) {
    data += addLn("Акционная цена", product.price);
    data += addLn("Цена до акции", product.oldPrice);
    data += addLn("Размер скидки", product.discount);
  }

  return data;
}

module.exports = {
  partClassSelector,
  sleep,
  parseUrl,
  formatProductCard,
};
