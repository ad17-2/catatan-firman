import Link from "next/link";
import type { Sermon } from "@/lib/supabase";

interface SermonCardProps {
  sermon: Sermon;
  index: number;
}

export function SermonCard({ sermon, index }: SermonCardProps) {
  const formattedDate = new Date(sermon.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Truncate summary to ~150 chars
  const truncatedSummary =
    sermon.summary.length > 150
      ? sermon.summary.substring(0, 150).trim() + "..."
      : sermon.summary;

  return (
    <Link
      href={`/${sermon.id}`}
      className={`group block opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
    >
      <article
        className="relative h-full rounded-lg overflow-hidden transition-all duration-500 ease-out group-hover:-translate-y-1"
        style={{
          backgroundColor: "var(--color-ivory)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        {/* Hover shadow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"
          style={{ boxShadow: "var(--shadow-elevated)" }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          style={{
            background: "linear-gradient(90deg, var(--color-sage) 0%, var(--color-gold) 100%)",
          }}
        />

        <div className="relative p-8">
          {/* Date */}
          <time
            className="block text-sm tracking-widest uppercase mb-4 font-body"
            style={{ color: "var(--color-ink-lighter)" }}
          >
            {formattedDate}
          </time>

          {/* Title */}
          <h2
            className="font-serif text-2xl font-semibold mb-4 leading-tight transition-colors duration-300"
            style={{ color: "var(--color-ink)" }}
          >
            <span className="group-hover:text-[var(--color-sage-dark)] transition-colors duration-300">
              {sermon.title}
            </span>
          </h2>

          {/* Summary preview */}
          <p
            className="font-body text-base leading-relaxed mb-6"
            style={{ color: "var(--color-ink-light)" }}
          >
            {truncatedSummary}
          </p>

          {/* Key points preview */}
          {sermon.key_points.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {sermon.key_points.slice(0, 2).map((point, i) => (
                <span
                  key={i}
                  className="inline-block px-3 py-1 rounded-full text-sm font-body"
                  style={{
                    backgroundColor: "var(--color-parchment)",
                    color: "var(--color-ink-light)",
                  }}
                >
                  {point.length > 40 ? point.substring(0, 40) + "..." : point}
                </span>
              ))}
              {sermon.key_points.length > 2 && (
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-body"
                  style={{
                    backgroundColor: "var(--color-parchment)",
                    color: "var(--color-ink-lighter)",
                  }}
                >
                  +{sermon.key_points.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Read more indicator */}
          <div
            className="flex items-center gap-2 font-serif text-sm font-medium tracking-wide"
            style={{ color: "var(--color-sage)" }}
          >
            <span>Read full summary</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Corner decorative element */}
        <div
          className="absolute bottom-0 right-0 w-16 h-16 opacity-5"
          style={{
            background: "radial-gradient(circle at bottom right, var(--color-sage) 0%, transparent 70%)",
          }}
        />
      </article>
    </Link>
  );
}
