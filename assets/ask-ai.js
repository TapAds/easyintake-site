(function () {
  var prompts = {
    en:
      "Based on https://easyintakeapp.com/ and https://easyintakeapp.com/ghl/, summarize Easy Intake in 4 bullet points: what it is, ideal customers (including GoHighLevel agencies and Spanish/English workflows), channels supported (voice, SMS, WhatsApp, chat, forms), and outputs (CRM fields, PDF, API). Do not invent pricing; say access is via beta or demo if not published.",
    es:
      "Según https://easyintakeapp.com/es/ y https://easyintakeapp.com/es/ghl/, resume Easy Intake en 4 viñetas: qué es, clientes ideales (incluye agencias GoHighLevel y flujos español/inglés), canales (voz, SMS, WhatsApp, chat, formularios), y salidas (CRM, PDF, API). No inventes precios; di beta o demo si no está publicado.",
  };

  window.easyIntakeAskClaude = function (lang) {
    var p = prompts[lang] || prompts.en;
    if (navigator.clipboard && p) {
      navigator.clipboard.writeText(p).catch(function () {});
    }
    window.open("https://claude.ai/new", "_blank", "noopener,noreferrer");
  };
})();
