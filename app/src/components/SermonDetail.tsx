"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { getTranslation } from "@/lib/translations";
import { getLocalizedSermon, type SermonRaw } from "@/lib/supabase";
import { LanguageToggle } from "./LanguageToggle";

interface SermonDetailProps {
  sermon: SermonRaw;
}

export function SermonDetail({ sermon: rawSermon }: SermonDetailProps) {
  const { lang } = useLanguage();
  const t = getTranslation(lang);
  const sermon = getLocalizedSermon(rawSermon, lang);

  const formattedDate = new Date(sermon.created_at).toLocaleDateString(
    lang === "id" ? "id-ID" : "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-sm border-b"
        style={{
          backgroundColor: "rgba(250, 248, 243, 0.9)",
          borderColor: "var(--color-parchment)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-serif text-sm font-medium tracking-wide transition-colors duration-200 hover:opacity-70"
            style={{ color: "var(--color-sage)" }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t.backToAll}
          </Link>
          <LanguageToggle />
        </div>
      </nav>

      {/* Header */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, var(--color-sage) 0%, transparent 50%),
                              radial-gradient(circle at 70% 80%, var(--color-gold) 0%, transparent 50%)`,
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-20">
          {/* Date */}
          <time
            className="block text-sm tracking-widest uppercase mb-6 font-body animate-fade-in"
            style={{ color: "var(--color-ink-lighter)" }}
          >
            {formattedDate}
          </time>

          {/* Title */}
          <h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6 animate-fade-in-up"
            style={{ color: "var(--color-ink)" }}
          >
            {sermon.title}
          </h1>

          {/* YouTube Video Link */}
          {rawSermon.youtube_url && (
            <a
              href={rawSermon.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 mb-8 opacity-0 animate-fade-in-up stagger-1"
            >
              {/* Play button with decorative ring */}
              <span className="relative flex items-center justify-center">
                {/* Outer decorative ring */}
                <span
                  className="absolute w-12 h-12 rounded-full border-2 opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500"
                  style={{ borderColor: "var(--color-gold)" }}
                />
                {/* Inner circle with play icon */}
                <span
                  className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                  style={{ backgroundColor: "var(--color-sage)" }}
                >
                  <svg
                    className="w-4 h-4 ml-0.5 transition-transform duration-300 group-hover:scale-110"
                    fill="var(--color-cream)"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
              {/* Text */}
              <span className="flex flex-col">
                <span
                  className="font-serif text-base font-medium tracking-wide transition-colors duration-300 group-hover:text-[var(--color-sage-dark)]"
                  style={{ color: "var(--color-sage)" }}
                >
                  {t.watchVideo}
                </span>
                <span
                  className="text-xs font-body tracking-wider uppercase transition-colors duration-300"
                  style={{ color: "var(--color-ink-lighter)" }}
                >
                  YouTube
                </span>
              </span>
              {/* External link indicator */}
              <svg
                className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300"
                fill="none"
                stroke="var(--color-ink-lighter)"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </a>
          )}

          {/* Decorative divider */}
          <div className="flex items-center gap-4 opacity-0 animate-fade-in-up stagger-2">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--color-parchment)" }}
            />
            <div
              className="w-2 h-2 rotate-45"
              style={{ backgroundColor: "var(--color-gold)" }}
            />
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--color-parchment)" }}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 pb-20">
        {/* Summary */}
        <section className="mb-16 opacity-0 animate-fade-in-up stagger-2">
          <h2
            className="font-serif text-2xl font-semibold mb-6 flex items-center gap-3"
            style={{ color: "var(--color-ink)" }}
          >
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{
                backgroundColor: "var(--color-sage)",
                color: "var(--color-cream)",
              }}
            >
              1
            </span>
            {t.summary}
          </h2>
          <div
            className="font-body text-lg leading-relaxed whitespace-pre-wrap pl-11"
            style={{ color: "var(--color-ink-light)" }}
          >
            {sermon.summary}
          </div>
        </section>

        {/* Key Points */}
        {sermon.key_points.length > 0 && (
          <section className="mb-16 opacity-0 animate-fade-in-up stagger-3">
            <h2
              className="font-serif text-2xl font-semibold mb-6 flex items-center gap-3"
              style={{ color: "var(--color-ink)" }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{
                  backgroundColor: "var(--color-sage)",
                  color: "var(--color-cream)",
                }}
              >
                2
              </span>
              {t.keyPoints}
            </h2>
            <ul className="space-y-4 pl-11">
              {sermon.key_points.map((point, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mt-0.5"
                    style={{
                      backgroundColor: "var(--color-parchment)",
                      color: "var(--color-ink-light)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="font-body text-lg"
                    style={{ color: "var(--color-ink-light)" }}
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Bible Verses */}
        {sermon.bible_verses.length > 0 && (
          <section className="mb-16 opacity-0 animate-fade-in-up stagger-4">
            <h2
              className="font-serif text-2xl font-semibold mb-6 flex items-center gap-3"
              style={{ color: "var(--color-ink)" }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{
                  backgroundColor: "var(--color-sage)",
                  color: "var(--color-cream)",
                }}
              >
                3
              </span>
              {t.bibleVerses}
            </h2>
            <div className="space-y-3 pl-11">
              {sermon.bible_verses.map((verse, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg"
                  style={{ backgroundColor: "var(--color-ivory)" }}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 mt-0.5"
                    fill="none"
                    stroke="var(--color-gold)"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                  <span
                    className="font-body text-lg"
                    style={{ color: "var(--color-ink-light)" }}
                  >
                    {verse}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quotes */}
        {sermon.quotes.length > 0 && (
          <section className="mb-16 opacity-0 animate-fade-in-up stagger-5">
            <h2
              className="font-serif text-2xl font-semibold mb-6 flex items-center gap-3"
              style={{ color: "var(--color-ink)" }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{
                  backgroundColor: "var(--color-sage)",
                  color: "var(--color-cream)",
                }}
              >
                4
              </span>
              {t.quotes}
            </h2>
            <div className="space-y-6 pl-11">
              {sermon.quotes.map((quote, i) => (
                <blockquote
                  key={i}
                  className="relative pl-6 py-2"
                  style={{ borderLeft: "3px solid var(--color-gold)" }}
                >
                  <p
                    className="font-serif text-xl italic leading-relaxed"
                    style={{ color: "var(--color-ink)" }}
                  >
                    &ldquo;{quote}&rdquo;
                  </p>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {/* Action Items */}
        {sermon.action_items.length > 0 && (
          <section className="mb-16 opacity-0 animate-fade-in-up stagger-6">
            <h2
              className="font-serif text-2xl font-semibold mb-6 flex items-center gap-3"
              style={{ color: "var(--color-ink)" }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{
                  backgroundColor: "var(--color-sage)",
                  color: "var(--color-cream)",
                }}
              >
                5
              </span>
              {t.actionItems}
            </h2>
            <ol className="space-y-4 pl-11">
              {sermon.action_items.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-4 p-4 rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: "var(--color-ivory)" }}
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{
                      backgroundColor: "var(--color-sage)",
                      color: "var(--color-cream)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="font-body text-lg pt-0.5"
                    style={{ color: "var(--color-ink-light)" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Reflection Questions */}
        {sermon.reflection_questions.length > 0 && (
          <section className="opacity-0 animate-fade-in-up stagger-6">
            <h2
              className="font-serif text-2xl font-semibold mb-6 flex items-center gap-3"
              style={{ color: "var(--color-ink)" }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{
                  backgroundColor: "var(--color-sage)",
                  color: "var(--color-cream)",
                }}
              >
                6
              </span>
              {t.reflectionQuestions}
            </h2>
            <div
              className="rounded-lg p-8 ml-11"
              style={{ backgroundColor: "var(--color-ivory)" }}
            >
              <ol className="space-y-6">
                {sermon.reflection_questions.map((question, i) => (
                  <li key={i} className="flex gap-4">
                    <span
                      className="flex-shrink-0 font-serif text-2xl font-semibold"
                      style={{ color: "var(--color-gold)" }}
                    >
                      {i + 1}.
                    </span>
                    <p
                      className="font-serif text-xl leading-relaxed pt-1"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {question}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </article>

      {/* Footer */}
      <footer
        className="border-t py-8"
        style={{ borderColor: "var(--color-parchment)" }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-serif text-sm font-medium tracking-wide transition-colors duration-200 hover:opacity-70"
            style={{ color: "var(--color-sage)" }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t.backToAll}
          </Link>
        </div>
      </footer>
    </main>
  );
}
