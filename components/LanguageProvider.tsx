"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isLanguageCode, translate, translateValue, type LanguageCode } from "@/lib/i18n";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
  tv: <T,>(key: string, fallbackValue: T) => T;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("cau-noi-language");
    return isLanguageCode(saved) ? saved : "en";
  });

  useEffect(() => {
    window.localStorage.setItem("cau-noi-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: string) => translate(language, key),
      tv: <T,>(key: string, fallbackValue: T) => translateValue(language, key, fallbackValue),
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
