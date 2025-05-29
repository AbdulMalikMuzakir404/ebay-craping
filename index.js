const minimist = require("minimist");
const { scrapeEbayProducts } = require("./scraper");
const { exportToJson, exportToCsv } = require("./exportUtil");
require("dotenv").config();

const args = minimist(process.argv.slice(2), {
  string: ["q", "ai", "exp"],
  boolean: ["headless"],
  default: {
    q: "nike",
    ai: null,
    limit: 0,
    headless: true,
    slowmo: 0,
    exp: null,
  },
});

console.log("\n📦 Parameter:");
console.log("🔍 Query      :", args.q);
console.log("🧠 AI Provider:", args.ai || "Tidak digunakan");
console.log("🖥️  Headless   :", args.headless);
console.log("🐢 SlowMo     :", args.slowmo + " ms");
console.log("🔢 Limit      :", args.limit);
console.log("📤 Export     :", args.exp || "Tidak ada");

(async () => {
  const products = await scrapeEbayProducts(args.q, args.ai, {
    headless: args.headless,
    slowMo: args.slowmo,
    limit: args.limit,
  });

  console.log("\n\n🧾 Total produk diambil:", products.length);
  console.log(JSON.stringify(products, null, 2));

  if (args.exp === "json") {
    exportToJson(products, "output.json");
  } else if (args.exp === "csv") {
    exportToCsv(products, "output.csv");
  }
})();
