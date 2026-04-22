(function () {
  var prompt =
    "What is Easy Intake—the AI-powered intake layer for service-based organizations—and how does it convert unstructured multi-lingual voice, SMS, and chat into structured, system-ready English data? Beyond simple translation, how does it handle guided follow-ups and data scoring to ensure 100% completeness for systems like CRMs, webforms, insurance carriers, and other destinations?";

  var prompts = {
    en: prompt,
    es: prompt,
  };

  window.easyIntakeAskClaude = function (lang) {
    var p = prompts[lang] || prompts.en;
    if (navigator.clipboard && p) {
      navigator.clipboard.writeText(p).catch(function () {});
    }
    window.open("https://claude.ai/new", "_blank", "noopener,noreferrer");
  };
})();
