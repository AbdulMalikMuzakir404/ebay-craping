const minimist = require("minimist");
const { scrapeEbayProducts } = require("./scraper");

(async () => {
  const args = minimist(process.argv.slice(2), {
    string: ["q", "ai"],
    boolean: ["headless"],
    default: {
      q: "nike",
      ai: null,
      headless: true,
      slowmo: 0,
      limit: 0,
    },
  });

  const keyword = args.q;
  const aiProvider = args.ai;
  const headless = args.headless;
  const slowMo = parseInt(args.slowmo) || 0;
  const limit = parseInt(args.limit) || 0;

  console.log(`\n📦 Parameter:`);
  console.log(`🔍 Query      : ${keyword}`);
  console.log(`🧠 AI Provider: ${aiProvider || "Tidak digunakan"}`);
  console.log(`🖥️  Headless   : ${headless}`);
  console.log(`🐢 SlowMo     : ${slowMo} ms`);
  console.log(`🔢 Limit      : ${limit > 0 ? limit : "Semua"}\n`);

  const products = await scrapeEbayProducts(keyword, aiProvider, {
    headless,
    slowMo,
    limit,
  });

  console.log(`\n🧾 Total produk diambil: ${products.length}`);
  console.log(JSON.stringify(products, null, 2));
})();
