"use client";

import Link from "next/link";
import type { Sermon } from "@/lib/types";

interface SermonCardProps {
  sermon: Sermon;
  index: number;
}

export function SermonCard({ sermon, index }: SermonCardProps) {
  const formattedDate = new Date(sermon.created_at).toLocaleDateString(
    "id-ID",
    { year: "numeric", month: "long", day: "numeric" },
  );

  const truncatedSummary =
    sermon.summary.length > 180
      ? sermon.summary.substring(0, 180).trim() + "..."
      : sermon.summary;

  return (
    <Link
      href={`/${sermon.id}`}
      className={`group block opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
    >
      <article
        className="relative h-full border rounded-xl overflow-hidden transition-all duration-500 ease-out group-hover:-translate-y-0.5"
        style={{
          backgroundColor: "var(--color-warm-white)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-sm)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "var(--shadow-lg)";
          e.currentTarget.style.borderColor = "var(--color-terracotta-light)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          e.currentTarget.style.borderColor = "var(--color-border)";
        }}
      >
        <div className="p-7 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <time
              className="text-xs font-body font-medium tracking-widest uppercase"
              style={{ color: "var(--color-ink-muted)" }}
            >
              {formattedDate}
            </time>
            {sermon.youtube_url && (
              <>
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: "var(--color-ink-muted)" }}
                />
                <span
                  className="text-xs font-body tracking-wider uppercase"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Video
                </span>
              </>
            )}
          </div>

          <h2
            className="font-display text-xl md:text-2xl font-600 mb-4 leading-snug transition-colors duration-300 group-hover:text-[var(--color-terracotta)]"
            style={{ color: "var(--color-ink)" }}
          >
            {sermon.title}
          </h2>

          <p
            className="font-body text-[15px] leading-relaxed mb-6"
            style={{ color: "var(--color-ink-secondary)" }}
          >
            {truncatedSummary}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {sermon.key_points.slice(0, 3).map((_, i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--color-terracotta)", opacity: 1 - i * 0.25 }}
                />
              ))}
              {sermon.key_points.length > 3 && (
                <span
                  className="text-[11px] font-body ml-1"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  {sermon.key_points.length} poin
                </span>
              )}
            </div>

            <span
              className="inline-flex items-center gap-1.5 text-xs font-display font-500 tracking-wide transition-colors duration-300 group-hover:text-[var(--color-terracotta)]"
              style={{ color: "var(--color-ink-muted)" }}
            >
              Baca
              <svg
                className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
