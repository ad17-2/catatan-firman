"use client";

import { useLanguage } from "@/lib/language-context";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="inline-flex rounded-full p-1"
      style={{ backgroundColor: "var(--color-ivory)" }}
    >
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1 rounded-full text-sm font-body transition-all duration-200 ${
          lang === "en" ? "font-medium" : ""
        }`}
        style={{
          backgroundColor: lang === "en" ? "var(--color-sage)" : "transparent",
          color:
            lang === "en" ? "var(--color-cream)" : "var(--color-ink-light)",
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLang("id")}
        className={`px-3 py-1 rounded-full text-sm font-body transition-all duration-200 ${
          lang === "id" ? "font-medium" : ""
        }`}
        style={{
          backgroundColor: lang === "id" ? "var(--color-sage)" : "transparent",
          color:
            lang === "id" ? "var(--color-cream)" : "var(--color-ink-light)",
        }}
      >
        ID
      </button>
    </div>
  );
}
