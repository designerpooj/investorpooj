import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data", "journal.json");

function readAll() {
  if (!fs.existsSync(DB_PATH)) return [];
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return raw.trim() ? JSON.parse(raw) : [];
}

function writeAll(entries) {
  fs.writeFileSync(DB_PATH, JSON.stringify(entries, null, 2));
}

export function getEntries() {
  return readAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function addEntry(entry) {
  const entries = readAll();
  const newEntry = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...entry
  };
  entries.push(newEntry);
  writeAll(entries);
  return newEntry;
}

export function deleteEntry(id) {
  const entries = readAll().filter((e) => e.id !== id);
  writeAll(entries);
}
