"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Accessibility,
  ExternalLink,
  Filter,
  Languages,
  MapPin,
  MonitorSmartphone,
  Phone,
  RotateCcw,
  Search,
  Tags,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { SkeletonResourceGrid } from "@/components/LoadingStates";
import { incrementImpact } from "@/lib/impact";
import { localizedOption, localizedResource } from "@/lib/i18n";
import {
  type CostFilter,
  type CityFilter,
  type LanguageFilter,
  type ModeFilter,
  type ResourceTypeFilter,
  cityOptions,
  costOptions,
  languageOptions,
  modeOptions,
  resourceTypeOptions,
  resources,
} from "@/lib/resources";

export function ResourceFinder() {
  const { language: appLanguage, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [languageMatch, setLanguageMatch] = useState<LanguageFilter>("All languages");
  const [language, setLanguage] = useState<LanguageFilter>("All languages");
  const [cost, setCost] = useState<CostFilter>("All costs");
  const [resourceType, setResourceType] = useState<ResourceTypeFilter>("All resource types");
  const [mode, setMode] = useState<ModeFilter>("Any format");
  const [city, setCity] = useState<CityFilter>("All cities");
  const [isFiltering, setIsFiltering] = useState(false);
  const didMount = useRef(false);

  const filteredResources = useMemo(
    () => {
      const filtered = resources.filter((resource) => {
        const normalizedQuery = query.trim().toLowerCase();
        const searchableText = [
          resource.name,
          resource.resourceType,
          resource.category,
          resource.city,
          resource.address ?? "",
          resource.description,
          resource.mode,
          resource.format,
          resource.serviceType,
          ...resource.languages,
          ...resource.costTypes,
          ...resource.ageGroups,
          ...resource.accessibility,
          ...resource.tags,
        ]
          .join(" ")
          .toLowerCase();
        const queryMatches = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);
        const languageMatches = language === "All languages" || resource.languages.includes(language);
        const costMatches = cost === "All costs" || resource.costTypes.includes(cost);
        const typeMatches = resourceType === "All resource types" || resource.resourceType === resourceType;
        const modeMatches = mode === "Any format" || resource.mode === mode;
        const cityMatches = city === "All cities" || resource.city === city;
        return queryMatches && languageMatches && costMatches && typeMatches && modeMatches && cityMatches;
      });

      return [...filtered].sort((a, b) => {
        if (languageMatch === "All languages") return 0;
        return Number(b.languages.includes(languageMatch)) - Number(a.languages.includes(languageMatch));
      });
    },
    [city, cost, language, languageMatch, mode, query, resourceType],
  );

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    setIsFiltering(true);
    const id = window.setTimeout(() => setIsFiltering(false), 180);
    return () => window.clearTimeout(id);
  }, [city, cost, language, languageMatch, mode, query, resourceType]);

  const resetFilters = () => {
    setQuery("");
    setLanguageMatch("All languages");
    setLanguage("All languages");
    setCost("All costs");
    setResourceType("All resource types");
    setMode("Any format");
    setCity("All cities");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="h-fit min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold text-slate-950">
            <Filter size={18} className="text-teal-700" aria-hidden="true" />
            {t("resourceFinder.filters")}
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 transition hover:bg-teal-50"
          >
            <RotateCcw size={14} aria-hidden="true" />
            {t("common.reset")}
          </button>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            {t("resourceFinder.search")}
            <span className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("resourceFinder.searchPlaceholder")}
                className="min-h-11 w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </span>
          </label>
          <FilterSelect label={t("resourceFinder.languageMatch")} value={languageMatch} options={languageOptions} onChange={setLanguageMatch} language={appLanguage} />
          <p className="-mt-2 text-xs leading-5 text-slate-500">{t("resourceFinder.languageMatchHelp")}</p>
          <FilterSelect label={t("resourceFinder.language")} value={language} options={languageOptions} onChange={setLanguage} language={appLanguage} />
          <FilterSelect label={t("resourceFinder.cost")} value={cost} options={costOptions} onChange={setCost} language={appLanguage} />
          <FilterSelect label={t("resourceFinder.type")} value={resourceType} options={resourceTypeOptions} onChange={setResourceType} language={appLanguage} />
          <FilterSelect label={t("resourceFinder.mode")} value={mode} options={modeOptions} onChange={setMode} language={appLanguage} />
          <FilterSelect label={t("resourceFinder.city")} value={city} options={cityOptions} onChange={setCity} language={appLanguage} />
        </div>

        <p className="mt-5 rounded-md bg-[#f6faf7] p-3 text-sm leading-6 text-slate-600">
          {t("resourceFinder.privateNote")}
        </p>
        <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          {t("resourceFinder.verifyNote")}
        </p>
      </aside>

      <section aria-label="Resource results" className="min-w-0">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">{t("resourceFinder.title")}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {t("resourceFinder.showing")} {filteredResources.length} {t("resourceFinder.of")} {resources.length} {t("resourceFinder.resources")}
            </p>
          </div>
          <span className="w-fit rounded-md bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-800">
            {t("resourceFinder.anonymous")}
          </span>
        </div>

        {isFiltering ? (
          <SkeletonResourceGrid count={Math.min(Math.max(filteredResources.length, 2), 6)} />
        ) : filteredResources.length > 0 ? (
          <div className="content-fade-in grid min-w-0 gap-4 md:grid-cols-2" aria-live="polite">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.name} resource={resource} language={appLanguage} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-950">{t("resourceFinder.emptyTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("resourceFinder.emptyBody")}</p>
          </div>
        )}
      </section>
    </div>
  );

  function ResourceCard({ resource, language }: { resource: (typeof resources)[number]; language: typeof appLanguage }) {
    const localized = localizedResource(language, resource);

    return (
      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                      {localized.category}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                      <MapPin size={16} aria-hidden="true" />
                      {resource.address ?? localized.city}
                      {resource.locationApproximate ? ` (${localized.city})` : ""}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950">{localized.name}</h3>
                  </div>
                  <span className="w-fit rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {localizedOption(language, resource.mode)}
                  </span>
                </div>

                <p className="mb-5 leading-7 text-slate-700">{localized.description}</p>

                <dl className="grid gap-3 text-sm text-slate-700">
                  <ResourceMeta icon={<Phone size={16} aria-hidden="true" />} label={t("resourceFinder.phone")} value={resource.phone} />
                  {resource.address && (
                    <ResourceMeta
                      icon={<MapPin size={16} aria-hidden="true" />}
                      label={t("resourceFinder.city")}
                      value={resource.address}
                    />
                  )}
                  <ResourceMeta
                    icon={<Languages size={16} aria-hidden="true" />}
                    label={t("resourceFinder.languages")}
                    value={resource.languages.map((item) => localizedOption(language, item)).join(", ")}
                  />
                  <ResourceMeta
                    icon={<MonitorSmartphone size={16} aria-hidden="true" />}
                    label={t("resourceFinder.format")}
                    value={localizedOption(language, resource.mode)}
                  />
                  <ResourceMeta
                    icon={<Accessibility size={16} aria-hidden="true" />}
                    label={t("resourceFinder.access")}
                    value={resource.accessibility.join("; ")}
                  />
                </dl>

                <div className="mt-4 flex flex-wrap gap-2" aria-label={`${resource.name} cost options`}>
                  {resource.costTypes.map((costType) => (
                    <span
                      key={costType}
                      className="rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-900"
                    >
                      {localizedOption(language, costType)}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-2" aria-label={`${resource.name} topic tags`}>
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-md bg-[#eef7f1] px-2.5 py-1 text-xs font-medium text-teal-900"
                    >
                      <Tags size={12} aria-hidden="true" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  {resource.websiteUrl ? (
                    <a
                      href={resource.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => incrementImpact("resourcesViewed")}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                    >
                      {t("common.website")}
                      <ExternalLink size={16} aria-hidden="true" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-md bg-slate-200 px-4 text-sm font-semibold text-slate-500"
                    >
                      {t("common.websiteComingSoon")}
                    </button>
                  )}
                  {!resource.phone.toLowerCase().includes("placeholder") && !resource.phone.toLowerCase().includes("ask school") && (
                    <a
                      href={`tel:${resource.phone.replace(/[^\d]/g, "") || resource.phone}`}
                      onClick={() => incrementImpact("resourcesViewed")}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-teal-700 px-4 text-sm font-semibold text-teal-800 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100"
                    >
                      {t("common.call")}
                      <Phone size={16} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
    );
  }
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  language,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  language: typeof import("@/lib/i18n").languages[number];
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-800">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="min-h-11 w-full max-w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {localizedOption(language, option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResourceMeta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 gap-2">
      <dt className="flex min-w-24 items-center gap-1.5 font-semibold text-slate-950">
        <span className="text-teal-700">{icon}</span>
        {label}
      </dt>
      <dd className="min-w-0 break-words">{value}</dd>
    </div>
  );
}
