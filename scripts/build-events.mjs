import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

const root = process.cwd();
const csvPath = path.join(root, "public", "events.csv");
const outPath = path.join(root, "public", "events.json");

if (!fs.existsSync(csvPath)) {
  console.error("❌ events.csv not found at project root:", csvPath);
  process.exit(1);
}

const csv = fs.readFileSync(csvPath, "utf-8");

const parsed = Papa.parse(csv, {
  header: true,
  skipEmptyLines: true,
});

if (parsed.errors?.length) {
  console.error("❌ CSV parse errors:", parsed.errors);
  process.exit(1);
}

const events = parsed.data.map((e) => ({
  ...e,
  event_id: e.event_id ? Number(e.event_id) : null,
  is_online: String(e.is_online).toUpperCase() === "TRUE",
  credits: e.credits ? Number(String(e.credits).replace(/[^\d.]/g, "")) : null,
}));

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(
  outPath,
  JSON.stringify({ updatedAt: new Date().toISOString(), events }, null, 2),
  "utf-8"
);

console.log(`✅ Generated public/events.json (${events.length} rows)`);
