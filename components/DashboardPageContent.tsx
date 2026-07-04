"use client";

import { Languages, ShieldCheck, Users } from "lucide-react";
import {
  InsightCard,
  LanguageAccessChart,
  MiniBarChart,
  ResourceCategoryChart,
  ResourceCoverageMap,
  StatCard,
} from "@/components/CivicVisualizations";
import { DashboardView } from "@/components/DashboardView";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";
import { communityContextSources } from "@/data/communityStats";
import { getResourceInsightData } from "@/lib/resourceInsights";

const icons = [Users, Languages, ShieldCheck];

export function DashboardPageContent() {
  const { t, tv } = useLanguage();
  const cards = tv<[string, string][]>("pages.dashboard.cards", []);
  const insights = getResourceInsightData();

  return (
    <>
      <PageHero eyebrow={t("pages.dashboard.eyebrow")} title={t("pages.dashboard.title")} vietnamese={t("pages.dashboard.subtitle")}>
        <p>{t("pages.dashboard.body")}</p>
      </PageHero>
      <Section title={t("pages.dashboard.indicatorsTitle")} intro={t("pages.dashboard.indicatorsIntro")}>
        <DashboardView />
      </Section>
      <Section title={t("visuals.dashboardContextTitle")} intro={t("visuals.dashboardContextIntro")} tone="mist">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label={t("visuals.totalResources")} value={insights.totalResources} helper={t("visuals.totalResourcesHelp")} />
          <StatCard label={t("visuals.citiesCovered")} value={insights.citiesCovered} helper={t("visuals.citiesCoveredHelp")} />
          <StatCard label={t("visuals.languagesSupported")} value={insights.languagesSupported} helper={t("visuals.languagesSupportedHelp")} />
          <StatCard label={t("visuals.categoriesAvailable")} value={insights.categoriesAvailable} helper={t("visuals.categoriesAvailableHelp")} />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <MiniBarChart data={insights.resourcesByCity} ariaLabel={t("visuals.resourcesByCity")} />
          <LanguageAccessChart data={insights.resourcesByLanguage} ariaLabel={t("visuals.languageAccess")} />
          <ResourceCategoryChart data={insights.resourcesByCategory} ariaLabel={t("visuals.resourcesByCategory")} />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <ResourceCoverageMap data={insights.cityCoverage} ariaLabel={t("visuals.coverageMap")} />
          <div className="grid gap-4">
            {communityContextSources.map((source) => (
              <InsightCard key={source.sourceUrl} {...source} />
            ))}
          </div>
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
