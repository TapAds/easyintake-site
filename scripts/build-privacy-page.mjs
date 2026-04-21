/**
 * Renders marketing Privacy Policy from the canonical JSON in easy-intake-app.
 * Source: ../../easy-intake-app/packages/shared/src/legal/privacy-en.json
 *
 * Outputs: en/privacy, privacy (/privacy), es/privacy (English body + ES chrome).
 *
 * Run from easy-intake-site: npm run build:privacy
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..", "..", "easy-intake-app");
const privacyPath = path.join(
  repoRoot,
  "packages",
  "shared",
  "src",
  "legal",
  "privacy-en.json"
);
const siteRoot = path.join(__dirname, "..");

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderBlocks(blocks) {
  return blocks
    .map((block) => {
      if (block.type === "list") {
        const items = block.items
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("\n");
        return `<ul class="list-disc pl-6 space-y-1 text-gray-400 my-3 marker:text-gray-600">\n${items}\n</ul>`;
      }
      if (block.type === "subheading") {
        return `<h3 class="text-base font-semibold text-white pt-2">${escapeHtml(block.text)}</h3>`;
      }
      return `<p class="text-gray-400 my-3 leading-relaxed whitespace-pre-wrap">${escapeHtml(block.text)}</p>`;
    })
    .join("\n");
}

function navPrivacyEn() {
  return `<nav class="fixed top-0 w-full z-50 px-6 py-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center glass rounded-full px-8 py-3">
            <a href="/" class="text-xl font-extrabold tracking-tight text-white">EASY<span class="text-blue-500">INTAKE</span></a>
            <div class="hidden md:flex items-center gap-x-8">
                <a href="/technology/" class="text-sm font-medium text-gray-400 hover:text-white transition">Technology</a>
                <div class="flex items-center gap-x-3 text-sm">
                    <span class="font-medium text-white">EN</span>
                    <span class="text-gray-600">|</span>
                    <a href="/es/privacy" class="font-medium text-gray-400 hover:text-white transition">ES</a>
                </div>
            </div>
        </div>
    </nav>`;
}

function navPrivacyEs() {
  return `<nav class="fixed top-0 w-full z-50 px-6 py-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center glass rounded-full px-8 py-3">
            <a href="/es/" class="text-xl font-extrabold tracking-tight text-white">EASY<span class="text-blue-500">INTAKE</span></a>
            <div class="hidden md:flex items-center gap-x-8">
                <a href="/es/technology/" class="text-sm font-medium text-gray-400 hover:text-white transition">Tecnología</a>
                <div class="flex items-center gap-x-3 text-sm">
                    <a href="/privacy" class="font-medium text-gray-400 hover:text-white transition">EN</a>
                    <span class="text-gray-600">|</span>
                    <span class="font-medium text-white">ES</span>
                </div>
            </div>
        </div>
    </nav>`;
}

function footerPrivacyEn() {
  return `<footer class="border-t border-white/10 py-8 px-6 mt-auto">
        <div class="max-w-7xl mx-auto text-center space-y-4">
            <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] tracking-widest uppercase text-gray-500">
                <a href="/terms" class="hover:text-gray-400">Terms of Service</a>
                <a href="/privacy" class="hover:text-gray-400">Privacy Policy</a>
            </div>
            <div class="flex justify-center items-center gap-3 text-xs text-gray-500">
                <span class="font-medium text-white">EN</span>
                <span class="text-gray-600">|</span>
                <a href="/es/privacy" class="hover:text-gray-400">ES</a>
            </div>
            <p class="text-[10px] tracking-widest uppercase text-gray-600">&copy; 2026 Easy Intake App. All rights reserved.</p>
        </div>
    </footer>`;
}

function footerPrivacyEs() {
  return `<footer class="border-t border-white/10 py-8 px-6 mt-auto">
        <div class="max-w-7xl mx-auto text-center space-y-4">
            <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] tracking-widest uppercase text-gray-500">
                <a href="/es/terms" class="hover:text-gray-400">Términos del servicio</a>
                <a href="/es/privacy" class="hover:text-gray-400">Política de privacidad</a>
            </div>
            <div class="flex justify-center items-center gap-3 text-xs text-gray-500">
                <a href="/privacy" class="hover:text-gray-400">EN</a>
                <span class="text-gray-600">|</span>
                <span class="font-medium text-white">ES</span>
            </div>
            <p class="text-[10px] tracking-widest uppercase text-gray-600">&copy; 2026 Easy Intake App. Todos los derechos reservados.</p>
        </div>
    </footer>`;
}

function renderMainContent(privacy) {
  const introHtml = privacy.intro
    .map((p) => `<p class="text-gray-400 my-3 leading-relaxed">${escapeHtml(p)}</p>`)
    .join("\n");

  const sectionsHtml = privacy.sections
    .map(
      (section) => `<section class="mt-10">
      <h2 class="text-lg font-semibold text-white">${escapeHtml(section.heading)}</h2>
      ${renderBlocks(section.content)}
    </section>`
    )
    .join("\n");

  return { introHtml, sectionsHtml };
}

function renderPage(privacy, opts) {
  const {
    htmlLang,
    canonical,
    hreflangs,
    h1Title,
    subtitle,
    lastUpdated,
    navHtml,
    footerHtml,
    noticeHtml,
    closingLine,
  } = opts;

  const { introHtml, sectionsHtml } = renderMainContent(privacy);

  const hreflangBlock = hreflangs
    .map(
      ({ lang, href }) =>
        `    <link rel="alternate" hreflang="${lang}" href="${href}" />`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(h1Title)} — Easy Intake App</title>
    <meta name="description" content="${escapeHtml(h1Title)} for Easy Intake App (${escapeHtml(privacy.productName)})." />
    <link rel="canonical" href="${canonical}" />
${hreflangBlock}
    <meta property="og:title" content="${escapeHtml(h1Title)}" />
    <meta property="og:type" content="website" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #030712; }
        .glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
    </style>
</head>
<body class="text-gray-200 antialiased min-h-screen flex flex-col">
    ${navHtml}

    <main class="flex-1 w-full max-w-3xl mx-auto px-6 pt-28 pb-16">
        <h1 class="text-2xl md:text-3xl font-bold text-white">${escapeHtml(h1Title)}</h1>
        <p class="mt-2 text-lg font-medium text-gray-300">${escapeHtml(subtitle)}</p>
        <p class="mt-1 text-sm text-gray-500">${escapeHtml(lastUpdated)}</p>
        ${noticeHtml || ""}
        <div class="mt-8 space-y-1">
            ${introHtml}
        </div>
        ${sectionsHtml}
        <p class="mt-16 text-sm text-gray-600">${closingLine}</p>
    </main>

    ${footerHtml}
</body>
</html>`;
}

const BASE = "https://www.easyintakeapp.com";

if (!fs.existsSync(privacyPath)) {
  console.error("Missing canonical privacy JSON at:", privacyPath);
  console.error("Expected easy-intake-app next to easy-intake-site.");
  process.exit(1);
}

const privacy = JSON.parse(fs.readFileSync(privacyPath, "utf8"));

const enCopyright = "&copy; 2026 Easy Intake App. All rights reserved.";
const esNotice = `<p class="mt-6 text-sm text-amber-200/90 border border-amber-500/20 bg-amber-500/5 rounded-lg px-4 py-3">El texto legal siguiente se presenta en inglés. Una versión traducida al español puede añadirse más adelante.</p>`;

const variants = [
  {
    out: path.join(siteRoot, "privacy", "index.html"),
    htmlLang: "en",
    canonical: `${BASE}/privacy`,
    hreflangs: [
      { lang: "en", href: `${BASE}/privacy` },
      { lang: "es", href: `${BASE}/es/privacy` },
      { lang: "x-default", href: `${BASE}/privacy` },
    ],
    h1Title: privacy.pageTitle,
    subtitle: privacy.productName,
    lastUpdated: privacy.lastUpdated,
    navHtml: navPrivacyEn(),
    footerHtml: footerPrivacyEn(),
    closingLine: enCopyright,
    noticeHtml: "",
  },
  {
    out: path.join(siteRoot, "en", "privacy", "index.html"),
    htmlLang: "en",
    canonical: `${BASE}/privacy`,
    hreflangs: [
      { lang: "en", href: `${BASE}/privacy` },
      { lang: "es", href: `${BASE}/es/privacy` },
      { lang: "x-default", href: `${BASE}/privacy` },
    ],
    h1Title: privacy.pageTitle,
    subtitle: privacy.productName,
    lastUpdated: privacy.lastUpdated,
    navHtml: navPrivacyEn(),
    footerHtml: footerPrivacyEn(),
    closingLine: enCopyright,
    noticeHtml: "",
  },
  {
    out: path.join(siteRoot, "es", "privacy", "index.html"),
    htmlLang: "es",
    canonical: `${BASE}/es/privacy`,
    hreflangs: [
      { lang: "en", href: `${BASE}/privacy` },
      { lang: "es", href: `${BASE}/es/privacy` },
      { lang: "x-default", href: `${BASE}/privacy` },
    ],
    h1Title: "Política de privacidad",
    subtitle: privacy.productName,
    lastUpdated: privacy.lastUpdated,
    navHtml: navPrivacyEs(),
    footerHtml: footerPrivacyEs(),
    closingLine: "&copy; 2026 Easy Intake App. Todos los derechos reservados.",
    noticeHtml: esNotice,
  },
];

for (const v of variants) {
  const html = renderPage(privacy, v);
  fs.mkdirSync(path.dirname(v.out), { recursive: true });
  fs.writeFileSync(v.out, html, "utf8");
  console.log("Wrote", v.out);
}
