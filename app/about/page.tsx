"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";

export default function AboutPage() {
  const { t, tv } = useLanguage();
  const cards = tv<[string, string][]>("pages.about.cards", []);

  return (
    <>
      <PageHero eyebrow={t("pages.about.eyebrow")} title={t("pages.about.title")} vietnamese={t("pages.about.subtitle")}>
        <p>{t("pages.about.body")}</p>
      </PageHero>
      <Section title={t("pages.about.why")}>
        <div className="grid gap-6 lg:grid-cols-3">
          {cards.map(([title, body]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{body}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section title={t("pages.about.boundaries")} tone="mist">
        <div className="max-w-3xl rounded-lg border border-slate-200 bg-white p-5 leading-7 text-slate-700 shadow-sm">
          <p>{t("pages.about.boundaryBody")}</p>
        </div>
      </Section>
    </>
  );
}
