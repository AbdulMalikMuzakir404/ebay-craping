const puppeteer = require("puppeteer");
const { cleanDescriptionWithAI } = require("./utils");

async function scrapeEbayProducts(keyword, aiProvider = null, options = {}) {
  const limit = options.limit || 0;

  if (aiProvider) {
    console.log(
      `🧠 Menggunakan AI Provider: ${aiProvider.toUpperCase()} (${
        options.model
      })`
    );
  } else {
    console.log("⚠️  Tanpa AI: Deskripsi tidak diringkas.");
  }

  console.log("🔄 Memulai scraping produk dari eBay...");

  const browser = await puppeteer.launch({
    headless: options.headless !== false,
    slowMo: options.slowMo || 0,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  let currentPage = 1;
  const products = [];

  const loadingInterval = setInterval(() => process.stdout.write("."), 300);

  try {
    while (true) {
      const url = `https://www.ebay.com/sch/i.html?_from=R40&_nkw=${keyword}&_sacat=0&rt=nc&_pgn=${currentPage}`;
      await page.goto(url, { waitUntil: "networkidle2" });

      const pageProducts = await page.$$eval(".s-item", (items) =>
        items.map((item) => {
          const name = item.querySelector(".s-item__title")?.innerText || "-";
          const price = item.querySelector(".s-item__price")?.innerText || "-";
          const link = item.querySelector(".s-item__link")?.href || "-";
          return { name, price, link };
        })
      );

      if (pageProducts.length === 0) break;

      for (const prod of pageProducts) {
        if (limit > 0 && products.length >= limit) break;

        if (prod.link !== "-") {
          try {
            const detailPage = await browser.newPage();
            await detailPage.goto(prod.link, { waitUntil: "networkidle2" });

            let rawDescription = "-";
            const selectors = [
              "#viTabs_0_is",
              "#vi-desc-maincntr",
              "[itemprop='description']",
              "#vi-desc-content",
            ];

            for (const selector of selectors) {
              rawDescription = await detailPage
                .$eval(selector, (el) => el.innerText)
                .catch(() => null);
              if (rawDescription) break;
            }

            rawDescription = rawDescription?.trim() || "-";

            prod.description = aiProvider
              ? await cleanDescriptionWithAI(
                  rawDescription,
                  aiProvider,
                  options.model
                )
              : rawDescription;

            prod.itemNumber = await detailPage.$$eval(
              "span.ux-textspans.ux-textspans--BOLD",
              (els) => {
                const match = els.find((el) => /^\d+$/.test(el.textContent));
                return match?.textContent.trim() || "-";
              }
            );

            await detailPage.close();
          } catch {
            prod.description = "-";
            prod.itemNumber = "-";
          }
        } else {
          prod.description = "-";
          prod.itemNumber = "-";
        }

        products.push(prod);
      }

      if (limit > 0 && products.length >= limit) {
        products.length = limit;
        break;
      }

      currentPage++;
    }
  } finally {
    clearInterval(loadingInterval);
    await browser.close();
  }

  return products;
}

module.exports = { scrapeEbayProducts };
