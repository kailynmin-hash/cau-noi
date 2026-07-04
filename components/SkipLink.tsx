"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function SkipLink() {
  const { t } = useLanguage();

  return (
    <a
      href="#main-content"
      className="sr-only z-50 rounded-md bg-teal-950 px-4 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {t("common.skipToMain")}
    </a>
  );
}
