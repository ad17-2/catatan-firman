"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push("/");
      }
    },
    [query, router]
  );

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto">
      <div className="relative group">
        {/* Decorative border */}
        <div
          className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, var(--color-sage-light) 0%, var(--color-gold-muted) 100%)",
          }}
        />

        <div
          className="relative flex items-center rounded-lg overflow-hidden"
          style={{ backgroundColor: "var(--color-ivory)" }}
        >
          {/* Search icon */}
          <div className="pl-5 pr-3" style={{ color: "var(--color-ink-lighter)" }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sermons..."
            className="flex-1 py-4 pr-4 bg-transparent outline-none font-body text-lg"
            style={{
              color: "var(--color-ink)",
              caretColor: "var(--color-sage)",
            }}
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                router.push("/");
              }}
              className="px-4 transition-colors duration-200 hover:opacity-70"
              style={{ color: "var(--color-ink-lighter)" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}

          <button
            type="submit"
            className="px-6 py-4 font-serif text-base font-medium tracking-wide transition-all duration-300 hover:tracking-wider"
            style={{
              backgroundColor: "var(--color-sage)",
              color: "var(--color-cream)",
            }}
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
