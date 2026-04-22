/**
 * Re-apply footer “Ask AI” strip from components/footer-ask-ai-*.html
 * Run from repo root: node scripts/inject-ask-ai-footer.mjs
 * (Only needed when adding new static pages—existing HTML is already patched.)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function extract(relPath, pad) {
  const lines = fs.readFileSync(path.join(root, relPath), "utf8").split("\n");
  const start = lines.findIndex((l) => l.includes('class="ask-ai-footer'));
  if (start < 0) throw new Error(`ask-ai-footer block not found in ${relPath}`);
  const raw = lines.slice(start).filter((l) => l.trim());
  const p = " ".repeat(pad);
  return raw.map((l) => p + l.replace(/^\s+/, "")).join("\n");
}

const en12 = extract("components/footer-ask-ai-en.html", 12);
const en16 = extract("components/footer-ask-ai-en.html", 16);
const es12 = extract("components/footer-ask-ai-es.html", 12);
const es16 = extract("components/footer-ask-ai-es.html", 16);

const STD_OPEN = `        <div class="max-w-7xl mx-auto text-center space-y-4">`;
const HOME_OPEN_EN = `        <footer class="mt-20 border-t border-white/10 pt-8">
            <div class="max-w-7xl mx-auto text-center space-y-4">`;
const HOME_OPEN_ES = `        <footer class="mt-20 border-t border-white/10 pt-8">
            <div class="max-w-7xl mx-auto text-center space-y-4">`;

function stdNew(block) {
  return `        <div class="max-w-7xl mx-auto space-y-6">\n${block}\n            <div class="text-center space-y-4">`;
}

function homeNew(block) {
  return `        <footer class="mt-20 border-t border-white/10 pt-8">
            <div class="max-w-7xl mx-auto space-y-6">\n${block}\n                <div class="text-center space-y-4">`;
}

function fixFooterCloseStd(s) {
  const re =
    /(<p class="text-\[10px\] tracking-widest uppercase text-gray-600">[^<]*<\/p>)\n        <\/div>\n    <\/footer>/;
  if (!re.test(s)) return null;
  return s.replace(
    re,
    `$1\n            </div>\n        </div>\n        <script src="/assets/ask-ai.js" defer></script>\n    </footer>`
  );
}

function fixFooterCloseHome(s) {
  const re =
    /(<p class="text-\[10px\] tracking-widest uppercase text-gray-600">[^<]*<\/p>)\n            <\/div>\n        <\/footer>\n    <\/section>/;
  if (!re.test(s)) return null;
  return s.replace(
    re,
    `$1\n                </div>\n            </div>\n        <script src="/assets/ask-ai.js" defer></script>\n        </footer>\n    </section>`
  );
}

const files = [
  ["index.html", "home", "en"],
  ["es/index.html", "home", "es"],
  ["ghl/index.html", "std", "en"],
  ["es/ghl/index.html", "std", "es"],
  ["technology/index.html", "std", "en"],
  ["es/technology/index.html", "std", "es"],
  ["technology/map/index.html", "std", "en"],
  ["es/technology/map/index.html", "std", "es"],
  ["en/signup/index.html", "std", "en"],
  ["es/signup/index.html", "std", "es"],
  ["privacy/index.html", "std", "en"],
  ["en/privacy/index.html", "std", "en"],
  ["es/privacy/index.html", "std", "es"],
  ["terms/index.html", "std", "en"],
  ["en/terms/index.html", "std", "en"],
  ["es/terms/index.html", "std", "es"],
];

for (const [rel, kind, lang] of files) {
  const fp = path.join(root, rel);
  let s = fs.readFileSync(fp, "utf8");
  if (s.includes("ask-ai-footer")) {
    console.log("skip (already)", rel);
    continue;
  }
  const block = lang === "en" ? (kind === "home" ? en16 : en12) : kind === "home" ? es16 : es12;

  if (kind === "home") {
    const open = lang === "en" ? HOME_OPEN_EN : HOME_OPEN_ES;
    if (!s.includes(open)) throw new Error(`home open not found: ${rel}`);
    s = s.replace(open, homeNew(block));
    s = fixFooterCloseHome(s);
  } else {
    if (!s.includes(STD_OPEN)) throw new Error(`std open not found: ${rel}`);
    s = s.replace(STD_OPEN, stdNew(block));
    s = fixFooterCloseStd(s);
  }
  if (s == null || !s.includes("ask-ai.js")) throw new Error(`patch failed: ${rel}`);
  fs.writeFileSync(fp, s);
  console.log("patched", rel);
}
