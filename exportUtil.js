
const fs = require("fs");
const path = require("path");

function exportToJson(data, filename = "output.json") {
  const filePath = path.resolve(__dirname, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`📄 Data exported to ${filePath}`);
}

function exportToCsv(data, filename = "output.csv") {
  const filePath = path.resolve(__dirname, filename);

  if (!Array.isArray(data) || data.length === 0) {
    console.log("❌ No data to export.");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","), // header row
    ...data.map((row) =>
      headers
        .map((field) => {
          let value = row[field];
          if (typeof value === "string") {
            value = value.replace(/"/g, '""'); // escape quotes
            return `"${value}"`;
          }
          return value;
        })
        .join(",")
    ),
  ];

  fs.writeFileSync(filePath, csvRows.join("\n"), "utf-8");
  console.log(`📄 Data exported to ${filePath}`);
}

module.exports = { exportToJson, exportToCsv };