"use client";

import Link from "next/link";
import { Languages, Menu, Waypoints } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { navItems } from "@/lib/content";
import { navTranslations, uiText } from "@/lib/i18n";

export function SiteHeader() {
  const { language, setLanguage } = useLanguage();
  const ui = uiText[language];
  const nav = navTranslations[language];

  return (
    <header className="sticky top-0 z-40 border-b border-teal-950/10 bg-[#f8fbf8]/92 shadow-sm shadow-teal-950/[0.03] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Cầu Nối home">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-teal-700 text-white shadow-sm shadow-teal-900/20">
            <Waypoints size={22} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-semibold text-slate-950">Cầu Nối</span>
            <span className="block text-xs font-medium uppercase tracking-[0.18em] text-teal-700">
              {ui.navSubtitle}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-teal-800 hover:shadow-sm"
            >
              {nav[item.key]}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <LanguageToggle language={language} setLanguage={setLanguage} label={ui.languageToggle} />
        </div>

        <details className="relative lg:hidden">
          <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-md border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 [&::-webkit-details-marker]:hidden">
            <Menu size={20} aria-hidden="true" />
            <span className="sr-only">{ui.openNavigation}</span>
          </summary>
          <div className="absolute right-0 mt-2 w-72 rounded-lg border border-slate-200 bg-white/98 p-2 shadow-xl shadow-slate-900/10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-3 text-sm font-medium text-slate-800 transition hover:bg-teal-50 hover:text-teal-900"
              >
                {nav[item.key]}
              </Link>
            ))}
            <div className="border-t border-slate-100 p-2">
              <LanguageToggle language={language} setLanguage={setLanguage} label={ui.languageToggle} />
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}

function LanguageToggle({
  language,
  setLanguage,
  label,
}: {
  language: "en" | "vi";
  setLanguage: (language: "en" | "vi") => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-sm" aria-label={label}>
      <Languages size={16} className="ml-2 text-teal-700" aria-hidden="true" />
      {(["en", "vi"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={`min-h-9 rounded px-3 text-sm font-semibold transition ${
            language === option ? "bg-teal-700 text-white shadow-sm" : "text-slate-700 hover:bg-teal-50"
          }`}
          aria-pressed={language === option}
        >
          {option === "en" ? "EN" : "VI"}
        </button>
      ))}
    </div>
  );
}
