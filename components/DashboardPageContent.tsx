"use client";

import { Languages, ShieldCheck, Users } from "lucide-react";
import { DashboardView } from "@/components/DashboardView";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";
import { DataGlowAccent } from "@/components/VisualStorytelling";

const icons = [Users, Languages, ShieldCheck];

export function DashboardPageContent() {
  const { t, tv } = useLanguage();
  const cards = tv<[string, string][]>("pages.dashboard.cards", []);

  return (
    <>
      <PageHero eyebrow={t("pages.dashboard.eyebrow")} title={t("pages.dashboard.title")} vietnamese={t("pages.dashboard.subtitle")} reflection={t("reflections.dashboard")}>
        <p>{t("pages.dashboard.body")}</p>
      </PageHero>
      <Section title={t("pages.dashboard.indicatorsTitle")} intro={t("pages.dashboard.indicatorsIntro")}>
        <div className="relative">
          <DataGlowAccent className="opacity-80" />
          <DashboardView />
        </div>
      </Section>
      <Section title={t("pages.dashboard.impactTitle")} intro={t("pages.dashboard.impactIntro")} tone="mist">
        <div className="grid gap-4 lg:grid-cols-3">
          {cards.map(([title, body], index) => {
            const Icon = icons[index];
            return (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon size={22} className="text-teal-700" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-semibold text-slate-950">{title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{body}</p>
              </article>
            );
          })}
        </div>
      </Section>
    </>
  );
}
