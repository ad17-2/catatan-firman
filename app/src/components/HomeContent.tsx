"use client";

import { Suspense } from "react";
import type { Sermon } from "@/lib/types";
import { SermonCard } from "./SermonCard";
import { SearchBar } from "./SearchBar";

interface HomeContentProps {
  sermons: Sermon[];
  searchQuery?: string;
}

export function HomeContent({ sermons, searchQuery }: HomeContentProps) {
  return (
    <main className="min-h-screen">
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 100%, rgba(181, 86, 63, 0.06) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 85% 10%, rgba(44, 62, 107, 0.04) 0%, transparent 50%),
              radial-gradient(ellipse 50% 40% at 50% 50%, rgba(196, 149, 42, 0.03) 0%, transparent 50%)
            `,
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-12 md:pt-28 md:pb-16">
          <div className="animate-fade-in mb-10 md:mb-14">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="h-px flex-1 max-w-[40px] animate-draw-line"
                style={{ backgroundColor: "var(--color-terracotta)" }}
              />
              <span
                className="text-[11px] font-body font-medium tracking-[0.2em] uppercase"
                style={{ color: "var(--color-terracotta)" }}
              >
                Khotbah &middot; Ringkasan &middot; Refleksi
              </span>
              <div
                className="h-px flex-1 max-w-[40px] animate-draw-line"
                style={{ backgroundColor: "var(--color-terracotta)" }}
              />
            </div>
          </div>

          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-700 tracking-tight text-center mb-5 animate-fade-in-up"
            style={{ color: "var(--color-ink)" }}
          >
            Catatan{" "}
            <em
              className="not-italic"
              style={{ color: "var(--color-terracotta)" }}
            >
              Firman
            </em>
          </h1>

          <p
            className="font-body text-lg md:text-xl text-center max-w-xl mx-auto mb-12 opacity-0 animate-fade-in-up stagger-1"
            style={{
              color: "var(--color-ink-secondary)",
              lineHeight: 1.7,
            }}
          >
            Ringkasan khotbah yang penuh makna, dilengkapi poin utama,
            ayat Alkitab, dan pertanyaan refleksi.
          </p>

          <div className="opacity-0 animate-fade-in-up stagger-2">
            <Suspense fallback={<div className="h-12" />}>
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-10 pb-24">
        {searchQuery && (
          <div className="mb-8 animate-fade-in">
            <p
              className="font-body text-base"
              style={{ color: "var(--color-ink-secondary)" }}
            >
              Menampilkan hasil untuk{" "}
              <span
                className="font-medium"
                style={{ color: "var(--color-ink)" }}
              >
                &ldquo;{searchQuery}&rdquo;
              </span>
            </p>
          </div>
        )}

        {sermons.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div
              className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl"
              style={{ backgroundColor: "var(--color-terracotta-muted)" }}
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="var(--color-terracotta)"
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
              className="font-display text-2xl font-600 mb-2"
              style={{ color: "var(--color-ink)" }}
            >
              {searchQuery
                ? "Tidak ada khotbah ditemukan"
                : "Belum ada khotbah"}
            </h3>
            <p
              className="font-body text-base"
              style={{ color: "var(--color-ink-muted)" }}
            >
              {searchQuery
                ? "Coba sesuaikan kata pencarian"
                : "Catatan firman akan muncul di sini"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {sermons.map((sermon, index) => (
              <SermonCard key={sermon.id} sermon={sermon} index={index} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t py-10" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p
            className="font-body text-sm italic"
            style={{ color: "var(--color-ink-muted)" }}
          >
            &ldquo;Bagi Dialah kemuliaan sampai selama-lamanya. Amin.&rdquo;
          </p>
          <p
            className="font-body text-xs mt-1 tracking-wide"
            style={{ color: "var(--color-ink-muted)" }}
          >
            Galatia 1:5
          </p>
        </div>
      </footer>
    </main>
  );
}
