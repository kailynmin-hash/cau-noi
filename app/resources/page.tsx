"use client";

import {
  LanguageAccessChart,
  MiniBarChart,
  ResourceCategoryChart,
  ResourceCoverageMap,
  StatCard,
} from "@/components/CivicVisualizations";
import { useLanguage } from "@/components/LanguageProvider";
import { ResourceFinder } from "@/components/ResourceFinder";
import { PageHero, Section } from "@/components/PageShell";
import { getResourceInsightData } from "@/lib/resourceInsights";

export default function ResourceFinderPage() {
  const { t } = useLanguage();
  const insights = getResourceInsightData();

  return (
    <>
      <PageHero eyebrow={t("resourcesPage.eyebrow")} title={t("resourcesPage.title")} vietnamese={t("resourcesPage.subtitle")}>
        <p>{t("resourcesPage.body")}</p>
      </PageHero>
      <Section title={t("visuals.resourcesSnapshotTitle")} intro={t("visuals.resourcesSnapshotIntro")} tone="mist">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label={t("visuals.totalResources")} value={insights.totalResources} helper={t("visuals.totalResourcesHelp")} />
          <StatCard label={t("visuals.focusCitiesCovered")} value={`${insights.focusCitiesCovered}/${insights.focusCitiesTotal}`} helper={t("visuals.focusCitiesCoveredHelp")} />
          <StatCard label={t("visuals.languagesSupported")} value={insights.languagesSupported} helper={t("visuals.languagesSupportedHelp")} />
          <StatCard label={t("visuals.categoriesAvailable")} value={insights.categoriesAvailable} helper={t("visuals.categoriesAvailableHelp")} />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <ResourceCoverageMap data={insights.cityCoverage} ariaLabel={t("visuals.coverageMap")} />
          <div className="grid gap-4">
            <MiniBarChart data={insights.resourcesByCity} ariaLabel={t("visuals.resourcesByCity")} />
            <LanguageAccessChart data={insights.resourcesByLanguage} ariaLabel={t("visuals.languageAccess")} />
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <ResourceCategoryChart data={insights.resourcesByCategory} ariaLabel={t("visuals.resourcesByCategory")} />
          <MiniBarChart data={insights.resourcesByFormat} ariaLabel={t("visuals.resourcesByFormat")} />
        </div>
      </Section>
      <Section intro={t("resourcesPage.intro")}>
        <ResourceFinder />
      </Section>
    </>
  );
}
