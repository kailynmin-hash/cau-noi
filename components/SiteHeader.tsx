"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe2, Menu } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { navItems } from "@/lib/content";
import { supportedLanguages, type LanguageCode } from "@/lib/languages";

export function SiteHeader() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-teal-950/10 bg-[#FFFDF7]/90 shadow-sm shadow-teal-950/[0.03] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center" aria-label="Cầu Nối home">
          <Image
            src="/brand/neural-bridge-logo.png"
            alt="Cầu Nối - Minds connect. Communities heal."
            width={1840}
            height={494}
            priority
            className="h-12 w-auto max-w-[11.5rem] object-contain sm:h-14 sm:max-w-[15rem] lg:max-w-[16.5rem]"
            sizes="(min-width: 1024px) 264px, (min-width: 640px) 240px, 184px"
          />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#EAF7EF] hover:text-teal-800 hover:shadow-sm"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <LanguageSelector language={language} setLanguage={setLanguage} label={t("common.languageLabel")} />
        </div>

        <details className="relative lg:hidden">
          <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-md border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-teal-200 hover:bg-[#EAF7EF] [&::-webkit-details-marker]:hidden">
            <Menu size={20} aria-hidden="true" />
            <span className="sr-only">{t("common.openNavigation")}</span>
          </summary>
          <div className="absolute right-0 mt-2 w-72 rounded-lg border border-slate-200 bg-white/98 p-2 shadow-xl shadow-slate-900/10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-3 text-sm font-medium text-slate-800 transition hover:bg-[#EAF7EF] hover:text-teal-900"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <div className="border-t border-slate-100 p-2">
              <LanguageSelector language={language} setLanguage={setLanguage} label={t("common.languageLabel")} />
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}

function LanguageSelector({
  language,
  setLanguage,
  label,
}: {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  label: string;
}) {
  return (
    <label className="flex min-w-0 items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 shadow-sm">
      <Globe2 size={16} className="shrink-0 text-teal-700" aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as LanguageCode)}
        className="min-h-9 max-w-[12rem] rounded bg-white px-2 text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-teal-100 sm:max-w-none"
        aria-label={label}
      >
        {supportedLanguages.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
