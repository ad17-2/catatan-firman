"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  useCallback,
  type ReactNode,
} from "react";
import type { Language } from "./translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
});

// Custom hook to read from localStorage with SSR support
function useLocalStorageLanguage(): Language {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }, []);

  const getSnapshot = useCallback((): Language => {
    const saved = localStorage.getItem("lang");
    return saved === "id" ? "id" : "en";
  }, []);

  const getServerSnapshot = useCallback((): Language => "en", []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const storedLang = useLocalStorageLanguage();
  const [lang, setLangState] = useState<Language>(storedLang);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
