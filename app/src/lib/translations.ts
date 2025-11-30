export const translations = {
  en: {
    title: "Sermon Summaries",
    subtitle:
      "Explore thoughtful summaries of sermons, complete with key points, scripture references, and reflection questions.",
    searchPlaceholder: "Search sermons...",
    showingResults: "Showing results for",
    noResults: "No sermons found",
    noSermons: "No sermons yet",
    noResultsHint: "Try adjusting your search terms",
    noSermonsHint: "Sermon summaries will appear here",
    summary: "Summary",
    keyPoints: "Key Points",
    bibleVerses: "Bible Verses",
    quotes: "Notable Quotes",
    actionItems: "Action Items",
    reflectionQuestions: "Reflection Questions",
    backToAll: "Back to all sermons",
    readMore: "Read full summary",
    more: "more",
    watchVideo: "Watch the Video",
    footerVerse:
      '"To Him be the glory forever and ever. Amen." — Galatians 1:5',
  },
  id: {
    title: "Ringkasan Khotbah",
    subtitle:
      "Jelajahi ringkasan khotbah yang penuh makna, dilengkapi dengan poin-poin utama, referensi ayat, dan pertanyaan refleksi.",
    searchPlaceholder: "Cari khotbah...",
    showingResults: "Menampilkan hasil untuk",
    noResults: "Tidak ada khotbah ditemukan",
    noSermons: "Belum ada khotbah",
    noResultsHint: "Coba sesuaikan kata pencarian",
    noSermonsHint: "Ringkasan khotbah akan muncul di sini",
    summary: "Ringkasan",
    keyPoints: "Poin Utama",
    bibleVerses: "Ayat Alkitab",
    quotes: "Kutipan Penting",
    actionItems: "Langkah Praktis",
    reflectionQuestions: "Pertanyaan Refleksi",
    backToAll: "Kembali ke semua khotbah",
    readMore: "Baca selengkapnya",
    more: "lagi",
    watchVideo: "Tonton Video",
    footerVerse:
      '"Bagi Dialah kemuliaan sampai selama-lamanya. Amin." — Galatia 1:5',
  },
} as const;

export type Language = "en" | "id";
export type TranslationKey = keyof typeof translations.en;

export function getTranslation(lang: Language) {
  return translations[lang];
}
