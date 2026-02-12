"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (query.trim()) {
        router.push(`/?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push("/");
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, router]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className="relative flex items-center rounded-full border transition-all duration-500"
        style={{
          borderColor: focused
            ? "var(--color-terracotta-light)"
            : "var(--color-border)",
          backgroundColor: "var(--color-warm-white)",
          boxShadow: focused
            ? "0 0 0 3px var(--color-terracotta-muted), var(--shadow-md)"
            : "var(--shadow-sm)",
        }}
      >
        <div
          className="pl-5 pr-2 transition-colors duration-300"
          style={{
            color: focused
              ? "var(--color-terracotta)"
              : "var(--color-ink-muted)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Cari khotbah..."
          className="flex-1 py-3.5 pr-4 bg-transparent outline-none font-body text-base"
          style={{ color: "var(--color-ink)" }}
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mr-3 p-1 rounded-full transition-all duration-200 hover:scale-110"
            style={{ color: "var(--color-ink-muted)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
