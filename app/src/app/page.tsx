import { Suspense } from "react";
import { getSermons } from "@/lib/supabase";
import { SearchBar } from "@/components/SearchBar";
import { SermonCard } from "@/components/SermonCard";

interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

async function SermonList({ searchQuery }: { searchQuery?: string }) {
  const sermons = await getSermons(searchQuery);

  if (sermons.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div
          className="inline-block w-16 h-16 mb-6 rounded-full"
          style={{ backgroundColor: "var(--color-parchment)" }}
        >
          <svg
            className="w-16 h-16 p-4"
            fill="none"
            stroke="var(--color-ink-lighter)"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
        </div>
        <h3
          className="font-serif text-2xl mb-3"
          style={{ color: "var(--color-ink)" }}
        >
          {searchQuery ? "No sermons found" : "No sermons yet"}
        </h3>
        <p
          className="font-body text-lg"
          style={{ color: "var(--color-ink-light)" }}
        >
          {searchQuery
            ? "Try adjusting your search terms"
            : "Sermon summaries will appear here"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {sermons.map((sermon, index) => (
        <SermonCard key={sermon.id} sermon={sermon} index={index} />
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="rounded-lg p-8"
          style={{ backgroundColor: "var(--color-ivory)" }}
        >
          <div className="skeleton h-4 w-24 rounded mb-4" />
          <div className="skeleton h-8 w-3/4 rounded mb-4" />
          <div className="skeleton h-20 w-full rounded mb-6" />
          <div className="flex gap-2">
            <div className="skeleton h-6 w-20 rounded-full" />
            <div className="skeleton h-6 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Home({ searchParams }: HomeProps) {
  const { q: searchQuery } = await searchParams;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="relative overflow-hidden">
        {/* Decorative background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, var(--color-sage) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, var(--color-gold) 0%, transparent 50%)`,
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
            <div
              className="h-px w-12"
              style={{ backgroundColor: "var(--color-sage-light)" }}
            />
            <div
              className="w-2 h-2 rotate-45"
              style={{ backgroundColor: "var(--color-gold)" }}
            />
            <div
              className="h-px w-12"
              style={{ backgroundColor: "var(--color-sage-light)" }}
            />
          </div>

          {/* Title */}
          <h1
            className="font-serif text-5xl md:text-6xl lg:text-7xl text-center font-semibold mb-6 animate-fade-in-up"
            style={{ color: "var(--color-ink)" }}
          >
            Sermon Summaries
          </h1>

          {/* Subtitle */}
          <p
            className="font-body text-xl text-center max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in-up stagger-1"
            style={{ color: "var(--color-ink-light)" }}
          >
            Explore thoughtful summaries of sermons, complete with key points,
            scripture references, and reflection questions.
          </p>

          {/* Search */}
          <div className="opacity-0 animate-fade-in-up stagger-2">
            <Suspense fallback={<div className="h-14" />}>
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        {searchQuery && (
          <div className="mb-8 animate-fade-in">
            <p
              className="font-body text-lg"
              style={{ color: "var(--color-ink-light)" }}
            >
              Showing results for{" "}
              <span
                className="font-medium"
                style={{ color: "var(--color-ink)" }}
              >
                &ldquo;{searchQuery}&rdquo;
              </span>
            </p>
          </div>
        )}

        <Suspense fallback={<LoadingSkeleton />}>
          <SermonList searchQuery={searchQuery} />
        </Suspense>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-8"
        style={{ borderColor: "var(--color-parchment)" }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p
            className="font-body text-sm"
            style={{ color: "var(--color-ink-lighter)" }}
          >
            Powered by AI-assisted sermon analysis
          </p>
        </div>
      </footer>
    </main>
  );
}
