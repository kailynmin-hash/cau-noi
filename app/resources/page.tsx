"use client";

import { useEffect, useState } from "react";
import {
  LanguageAccessChart,
  MiniBarChart,
  ResourceCategoryChart,
  ResourceCoverageMap,
  StatCard,
} from "@/components/CivicVisualizations";
import { useLanguage } from "@/components/LanguageProvider";
import { SkeletonChart, SkeletonStatGrid } from "@/components/LoadingStates";
import { ResourceFinder } from "@/components/ResourceFinder";
import { PageHero, Section } from "@/components/PageShell";
import { CompassLeafIllustration, DataGlowAccent } from "@/components/VisualStorytelling";
import { getResourceInsightData } from "@/lib/resourceInsights";

export default function ResourceFinderPage() {
  const { t } = useLanguage();
  const [ready, setReady] = useState(false);
  const insights = getResourceInsightData();

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <PageHero eyebrow={t("resourcesPage.eyebrow")} title={t("resourcesPage.title")} vietnamese={t("resourcesPage.subtitle")} reflection={t("reflections.resources")}>
        <p>{t("resourcesPage.body")}</p>
      </PageHero>
      <Section title={t("visuals.resourcesSnapshotTitle")} intro={t("visuals.resourcesSnapshotIntro")} tone="mist">
        <div className="pointer-events-none absolute right-8 top-12 hidden opacity-70 xl:block" aria-hidden="true">
          <CompassLeafIllustration className="h-44 w-60 drop-shadow-[0_18px_32px_rgba(46,90,62,0.12)]" />
        </div>
        {!ready ? (
          <div className="grid gap-6" aria-busy="true">
            <SkeletonStatGrid />
            <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <SkeletonChart />
              <div className="grid gap-4">
                <SkeletonChart />
                <SkeletonChart />
              </div>
            </div>
          </div>
        ) : (
          <div className="content-fade-in">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label={t("visuals.totalResources")} value={insights.totalResources} helper={t("visuals.totalResourcesHelp")} />
              <StatCard label={t("visuals.focusCitiesCovered")} value={`${insights.focusCitiesCovered}/${insights.focusCitiesTotal}`} helper={t("visuals.focusCitiesCoveredHelp")} />
              <StatCard label={t("visuals.languagesSupported")} value={insights.languagesSupported} helper={t("visuals.languagesSupportedHelp")} />
              <StatCard label={t("visuals.categoriesAvailable")} value={insights.categoriesAvailable} helper={t("visuals.categoriesAvailableHelp")} />
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <ResourceCoverageMap
                data={insights.cityCoverage}
                ariaLabel={t("visuals.coverageMap")}
                summary={{
                  totalResources: insights.totalResources,
                  citiesCovered: insights.focusCitiesCovered,
                  languagesSupported: insights.languagesSupported,
                }}
                labels={{
                  title: t("visuals.coverageTitle"),
                  resources: t("visuals.resourcesLabel"),
                  cities: t("visuals.citiesLabel"),
                  languages: t("visuals.languagesLabel"),
                  fewResources: t("visuals.fewResources"),
                  manyResources: t("visuals.manyResources"),
                  supportAvailable: t("visuals.supportAvailable"),
                  supportedLanguages: t("visuals.supportedLanguages"),
                  topCategories: t("visuals.topCategories"),
                  selectCity: t("visuals.selectCity"),
                  legend: t("visuals.legend"),
                }}
              />
              <div className="grid gap-4">
                <MiniBarChart data={insights.resourcesByCity} ariaLabel={t("visuals.resourcesByCity")} />
                <LanguageAccessChart data={insights.resourcesByLanguage} ariaLabel={t("visuals.languageAccess")} />
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <ResourceCategoryChart data={insights.resourcesByCategory} ariaLabel={t("visuals.resourcesByCategory")} />
              <MiniBarChart data={insights.resourcesByFormat} ariaLabel={t("visuals.resourcesByFormat")} />
            </div>
          </div>
        )}
      </Section>
      <Section intro={t("resourcesPage.intro")}>
        <div className="relative">
          <DataGlowAccent className="opacity-70" />
          <ResourceFinder />
        </div>
      </Section>
    </>
  );
}
