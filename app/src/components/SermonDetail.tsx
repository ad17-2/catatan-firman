"use client";

import Link from "next/link";
import type { Sermon } from "@/lib/types";

interface SermonDetailProps {
  sermon: Sermon;
}

const SECTIONS = [
  { key: "summary", label: "Ringkasan", icon: "M4 6h16M4 12h16M4 18h7" },
  { key: "key_points", label: "Poin Utama", icon: "M9 5l7 7-7 7" },
  { key: "bible_verses", label: "Ayat Alkitab", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" },
  { key: "quotes", label: "Kutipan", icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.2 48.2 0 005.024-.138c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" },
  { key: "action_items", label: "Langkah Praktis", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "reflection_questions", label: "Refleksi", icon: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" },
] as const;

export function SermonDetail({ sermon }: SermonDetailProps) {
  const formattedDate = new Date(sermon.created_at).toLocaleDateString(
    "id-ID",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" },
  );

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: sermon.title, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <main className="min-h-screen">
      <nav
        className="sticky top-0 z-50 backdrop-blur-md border-b"
        style={{
          backgroundColor: "rgba(247, 243, 237, 0.92)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-display text-sm font-500 transition-colors duration-200 hover:text-[var(--color-terracotta)]"
            style={{ color: "var(--color-ink-secondary)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Semua Khotbah
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display font-500 border transition-all duration-200 hover:border-[var(--color-terracotta)] hover:text-[var(--color-terracotta)]"
            style={{
              color: "var(--color-ink-secondary)",
              borderColor: "var(--color-border)",
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            Bagikan
          </button>
        </div>
      </nav>

      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 10% 90%, rgba(181, 86, 63, 0.05) 0%, transparent 50%),
              radial-gradient(ellipse 50% 40% at 90% 20%, rgba(196, 149, 42, 0.04) 0%, transparent 50%)
            `,
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-14">
          <time
            className="block text-xs font-body font-medium tracking-[0.15em] uppercase mb-5 animate-fade-in"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {formattedDate}
          </time>

          <h1
            className="font-display text-3xl md:text-5xl lg:text-[3.5rem] font-700 leading-[1.15] mb-8 animate-fade-in-up"
            style={{ color: "var(--color-ink)" }}
          >
            {sermon.title}
          </h1>

          {sermon.youtube_url && (
            <a
              href={sermon.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 opacity-0 animate-fade-in-up stagger-1"
            >
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: "var(--color-terracotta)" }}
              >
                <svg className="w-4 h-4 ml-0.5" fill="var(--color-warm-white)" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="flex flex-col">
                <span
                  className="font-display text-sm font-500 transition-colors duration-300 group-hover:text-[var(--color-terracotta)]"
                  style={{ color: "var(--color-ink)" }}
                >
                  Tonton Video
                </span>
                <span className="text-[11px] font-body" style={{ color: "var(--color-ink-muted)" }}>
                  YouTube
                </span>
              </span>
            </a>
          )}

          <div
            className="mt-10 h-px opacity-0 animate-fade-in stagger-2"
            style={{ backgroundColor: "var(--color-border)" }}
          />
        </div>
      </header>

      <div
        className="border-b sticky top-[49px] z-40 backdrop-blur-md overflow-x-auto opacity-0 animate-fade-in stagger-2"
        style={{
          backgroundColor: "rgba(247, 243, 237, 0.92)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <nav className="flex gap-1 py-2 -mx-2">
            {SECTIONS.map(({ key, label }) => {
              const hasContent =
                key === "summary"
                  ? !!sermon.summary
                  : (sermon[key] as string[])?.length > 0;
              if (!hasContent) return null;

              return (
                <a
                  key={key}
                  href={`#${key}`}
                  className="px-3 py-1.5 rounded-md text-xs font-display font-500 whitespace-nowrap transition-all duration-200 hover:bg-[var(--color-terracotta-muted)] hover:text-[var(--color-terracotta)]"
                  style={{ color: "var(--color-ink-secondary)" }}
                >
                  {label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 pt-10 pb-24">
        <section id="summary" className="mb-14 scroll-mt-28 opacity-0 animate-fade-in-up stagger-3">
          <SectionHeader label="Ringkasan" index={0} />
          <div
            className="font-body text-[17px] leading-[1.85] whitespace-pre-wrap drop-cap"
            style={{ color: "var(--color-ink-secondary)" }}
          >
            {sermon.summary}
          </div>
        </section>

        {sermon.key_points.length > 0 && (
          <section id="key_points" className="mb-14 scroll-mt-28 opacity-0 animate-fade-in-up stagger-4">
            <SectionHeader label="Poin Utama" index={1} />
            <ul className="space-y-3">
              {sermon.key_points.map((point, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-display font-600 mt-0.5"
                    style={{
                      backgroundColor: "var(--color-terracotta-muted)",
                      color: "var(--color-terracotta)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="font-body text-[16px] leading-relaxed"
                    style={{ color: "var(--color-ink-secondary)" }}
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {sermon.bible_verses.length > 0 && (
          <section id="bible_verses" className="mb-14 scroll-mt-28 opacity-0 animate-fade-in-up stagger-5">
            <SectionHeader label="Ayat Alkitab" index={2} />
            <div className="space-y-2.5">
              {sermon.bible_verses.map((verse, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg border"
                  style={{
                    backgroundColor: "var(--color-amber-muted)",
                    borderColor: "transparent",
                  }}
                >
                  <svg
                    className="flex-shrink-0 w-4 h-4 mt-1"
                    fill="none"
                    stroke="var(--color-amber)"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                  <span
                    className="font-body text-[15px] leading-relaxed"
                    style={{ color: "var(--color-ink-secondary)" }}
                  >
                    {verse}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {sermon.quotes.length > 0 && (
          <section id="quotes" className="mb-14 scroll-mt-28 opacity-0 animate-fade-in-up stagger-6">
            <SectionHeader label="Kutipan Penting" index={3} />
            <div className="space-y-8">
              {sermon.quotes.map((quote, i) => (
                <blockquote key={i} className="relative pl-6 md:pl-8">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                    style={{ backgroundColor: "var(--color-terracotta)" }}
                  />
                  <p
                    className="font-display text-lg md:text-xl font-400 italic leading-relaxed"
                    style={{ color: "var(--color-ink)" }}
                  >
                    &ldquo;{quote}&rdquo;
                  </p>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {sermon.action_items.length > 0 && (
          <section id="action_items" className="mb-14 scroll-mt-28 opacity-0 animate-fade-in-up stagger-7">
            <SectionHeader label="Langkah Praktis" index={4} />
            <ol className="space-y-3">
              {sermon.action_items.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-4 items-start p-4 rounded-lg border transition-colors duration-200 hover:border-[var(--color-terracotta-light)]"
                  style={{
                    backgroundColor: "var(--color-warm-white)",
                    borderColor: "var(--color-border-light)",
                  }}
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-600"
                    style={{
                      backgroundColor: "var(--color-terracotta)",
                      color: "var(--color-warm-white)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="font-body text-[16px] leading-relaxed pt-0.5"
                    style={{ color: "var(--color-ink-secondary)" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {sermon.reflection_questions.length > 0 && (
          <section id="reflection_questions" className="scroll-mt-28 opacity-0 animate-fade-in-up stagger-8">
            <SectionHeader label="Pertanyaan Refleksi" index={5} />
            <div
              className="rounded-xl p-6 md:p-8 border"
              style={{
                backgroundColor: "var(--color-warm-white)",
                borderColor: "var(--color-border-light)",
              }}
            >
              <ol className="space-y-6">
                {sermon.reflection_questions.map((question, i) => (
                  <li key={i} className="flex gap-4">
                    <span
                      className="flex-shrink-0 font-display text-2xl font-700"
                      style={{ color: "var(--color-amber)" }}
                    >
                      {i + 1}.
                    </span>
                    <p
                      className="font-display text-lg md:text-xl font-400 leading-relaxed pt-0.5"
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

      <footer className="border-t py-10" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-display text-sm font-500 transition-colors duration-200 hover:text-[var(--color-terracotta)]"
            style={{ color: "var(--color-ink-secondary)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Semua Khotbah
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-sm font-display font-500 transition-colors duration-200 hover:text-[var(--color-terracotta)]"
            style={{ color: "var(--color-ink-secondary)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            Bagikan
          </button>
        </div>
      </footer>
    </main>
  );
}

function SectionHeader({ label, index }: { label: string; index: number }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="text-[11px] font-display font-600 tracking-widest uppercase"
        style={{ color: "var(--color-terracotta)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div
        className="h-px flex-1"
        style={{ backgroundColor: "var(--color-border)" }}
      />
      <h2
        className="font-display text-sm font-600 tracking-wide uppercase"
        style={{ color: "var(--color-ink)" }}
      >
        {label}
      </h2>
      <div
        className="h-px flex-1"
        style={{ backgroundColor: "var(--color-border)" }}
      />
    </div>
  );
}
