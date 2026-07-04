"use client";

import { HeartHandshake, HomeIcon, Languages, Quote, Sparkles, TrendingUp } from "lucide-react";
import {
  InsightCard,
  LanguageAccessChart,
  ResourceCategoryChart,
  ResourceCoverageMap,
  StatCard,
} from "@/components/CivicVisualizations";
import { useLanguage } from "@/components/LanguageProvider";
import { communityContextSources } from "@/data/communityStats";
import { getResourceInsightData } from "@/lib/resourceInsights";

export function HomeShowcase() {
  const { t, tv } = useLanguage();
  const stats = tv<[string, string][]>("homeShowcase.stats", []);
  const testimonials = tv<string[]>("homeShowcase.testimonials", []);
  const insights = getResourceInsightData();

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label={t("visuals.homeSnapshotTitle")}>
        <StatCard label={t("visuals.totalResources")} value={insights.totalResources} helper={t("visuals.totalResourcesHelp")} icon={<HeartHandshake size={20} aria-hidden="true" />} />
        <StatCard label={t("visuals.citiesCovered")} value={insights.citiesCovered} helper={t("visuals.citiesCoveredHelp")} icon={<HomeIcon size={20} aria-hidden="true" />} />
        <StatCard label={t("visuals.languagesSupported")} value={insights.languagesSupported} helper={t("visuals.languagesSupportedHelp")} icon={<Languages size={20} aria-hidden="true" />} />
        <StatCard label={t("visuals.categoriesAvailable")} value={insights.categoriesAvailable} helper={t("visuals.categoriesAvailableHelp")} icon={<Sparkles size={20} aria-hidden="true" />} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-xl font-semibold text-slate-950">{t("visuals.resourcesByCategory")}</h3>
          <ResourceCategoryChart data={insights.resourcesByCategory} ariaLabel={t("visuals.resourcesByCategory")} framed={false} />
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-xl font-semibold text-slate-950">{t("visuals.languageAccess")}</h3>
          <LanguageAccessChart data={insights.resourcesByLanguage} ariaLabel={t("visuals.languageAccess")} framed={false} />
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
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
          {communityContextSources.map((source) => (
            <InsightCard key={source.sourceUrl} {...source} />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <TrendingUp size={22} className="text-teal-700" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-950">{t("homeShowcase.statsTitle")}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([value, label], index) => (
            <article key={label} className="rounded-lg border border-slate-200 bg-[#f6faf7] p-5">
              <p className="animate-rise-in text-4xl font-semibold text-teal-800" style={{ animationDelay: `${index * 70}ms` }}>
                {value}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-600">{label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Sparkles size={22} className="text-teal-700" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-950">{t("homeShowcase.testimonialsTitle")}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial} className="rounded-lg border border-slate-200 bg-[#f6faf7] p-5">
              <Quote size={20} className="text-teal-700" aria-hidden="true" />
              <p className="mt-3 leading-7 text-slate-700">{testimonial}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
