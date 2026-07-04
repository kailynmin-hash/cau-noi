"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Building2,
  Clock3,
  HeartHandshake,
  Languages,
  Loader2,
  MessageCircleHeart,
  Sparkles,
  Users,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  LanguageAccessChart,
  MiniBarChart,
  ResourceCategoryChart,
  ResourceCoverageMap,
  TrendLineChart,
} from "@/components/CivicVisualizations";
import { useLanguage } from "@/components/LanguageProvider";
import { getResourceInsightData, type ChartDatum } from "@/lib/resourceInsights";
import { supabase, type SurveyResponse } from "@/lib/supabase";

type DashboardStatus = "loading" | "ready" | "empty" | "error";

const tableName = "survey_responses" as const;

export function DashboardView() {
  const { language, t } = useLanguage();
  const text = {
    loading: t("dashboard.loading"),
    errorTitle: t("dashboard.errorTitle"),
    errorBody: t("dashboard.errorBody"),
    emptyTitle: t("dashboard.emptyTitle"),
    emptyBody: t("dashboard.emptyBody"),
    live: t("dashboard.live"),
    total: t("dashboard.total"),
    averages: t("dashboard.averages"),
    breakdowns: t("dashboard.breakdowns"),
    languageBreakdown: t("dashboard.languageBreakdown"),
    insights: t("dashboard.insights"),
    comfort: t("dashboard.comfort"),
    help: t("dashboard.help"),
    barrier: t("dashboard.barrier"),
    stigma: t("dashboard.stigma"),
    bilingual: t("dashboard.bilingual"),
    highBarrier: t("dashboard.highBarrier"),
    lowComfort: t("dashboard.lowComfort"),
    lowAwareness: t("dashboard.lowAwareness"),
    scale: t("dashboard.scale"),
    percentHelp: t("dashboard.percentHelp"),
    aggregateOnly: t("dashboard.aggregateOnly"),
    aggregateHelper: t("dashboard.aggregateHelper"),
    realtime: t("dashboard.realtime"),
    noLanguage: t("dashboard.noLanguage"),
    responsesLabel: t("dashboard.responsesLabel"),
    surveyTrend: t("visuals.surveyTrend"),
    sourceSurvey: t("dashboardPro.sourceSurvey"),
    sourceResources: t("dashboardPro.sourceResources"),
    sourceCombined: t("dashboardPro.sourceCombined"),
    snapshotTitle: t("dashboardPro.snapshotTitle"),
    snapshotBody: t("dashboardPro.snapshotBody"),
    communityResponses: t("dashboardPro.communityResponses"),
    lastUpdated: t("dashboardPro.lastUpdated"),
    loadedStatus: t("dashboardPro.loadedStatus"),
    totalResources: t("visuals.totalResources"),
    citiesCovered: t("visuals.citiesCovered"),
    languagesSupported: t("visuals.languagesSupported"),
    keyFindings: t("dashboardPro.keyFindings"),
    executiveSignal: t("dashboardPro.executiveSignal"),
    surveyTitle: t("dashboardPro.surveyTitle"),
    surveySubtitle: t("dashboardPro.surveySubtitle"),
    surveyExplain: t("dashboardPro.surveyExplain"),
    questionTitle: t("dashboardPro.questionTitle"),
    questionSubtitle: t("dashboardPro.questionSubtitle"),
    questionExplain: t("dashboardPro.questionExplain"),
    percentageTitle: t("dashboardPro.percentageTitle"),
    percentageSubtitle: t("dashboardPro.percentageSubtitle"),
    percentageExplain: t("dashboardPro.percentageExplain"),
    languageTitle: t("dashboardPro.languageTitle"),
    languageSubtitle: t("dashboardPro.languageSubtitle"),
    languageExplain: t("dashboardPro.languageExplain"),
    resourceCityTitle: t("dashboardPro.resourceCityTitle"),
    resourceCitySubtitle: t("dashboardPro.resourceCitySubtitle"),
    resourceCityExplain: t("dashboardPro.resourceCityExplain"),
    categoryTitle: t("dashboardPro.categoryTitle"),
    categorySubtitle: t("dashboardPro.categorySubtitle"),
    categoryExplain: t("dashboardPro.categoryExplain"),
    accessTitle: t("dashboardPro.accessTitle"),
    accessSubtitle: t("dashboardPro.accessSubtitle"),
    accessExplain: t("dashboardPro.accessExplain"),
    coverageTitle: t("dashboardPro.coverageTitle"),
    coverageSubtitle: t("dashboardPro.coverageSubtitle"),
    coverageExplain: t("dashboardPro.coverageExplain"),
    resourcesLabel: t("visuals.resourcesLabel"),
    citiesLabel: t("visuals.citiesLabel"),
    languagesLabel: t("visuals.languagesLabel"),
    fewResources: t("visuals.fewResources"),
    manyResources: t("visuals.manyResources"),
    supportAvailable: t("visuals.supportAvailable"),
    supportedLanguages: t("visuals.supportedLanguages"),
    topCategories: t("visuals.topCategories"),
    selectCity: t("visuals.selectCity"),
    legend: t("visuals.legend"),
    mostSupportedLanguage: t("dashboardPro.mostSupportedLanguage"),
    mostSupportedLanguageBody: t("dashboardPro.mostSupportedLanguageBody"),
    highestConcentration: t("dashboardPro.highestConcentration"),
    highestConcentrationBody: t("dashboardPro.highestConcentrationBody"),
    mostCommonFormat: t("dashboardPro.mostCommonFormat"),
    mostCommonFormatBody: t("dashboardPro.mostCommonFormatBody"),
    leadingCategory: t("dashboardPro.leadingCategory"),
    leadingCategoryBody: t("dashboardPro.leadingCategoryBody"),
    bilingualSignal: t("dashboardPro.bilingualSignal"),
    bilingualSignalBody: t("dashboardPro.bilingualSignalBody"),
  };
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadResponses = useCallback(async () => {
    const { data, error: readError } = await supabase.from(tableName).select("*", { count: "exact" });

    if (readError) {
      console.error("dashboard survey_responses read error", readError);
      setStatus("error");
      setError(readError.message);
      return;
    }
    const next = sortResponsesByCreatedAt((data ?? []) as SurveyResponse[]);
    setResponses(next);
    setLastUpdated(new Date());
    setStatus(next.length ? "ready" : "empty");
  }, []);

  useEffect(() => {
    const firstLoad = window.setTimeout(loadResponses, 0);

    const channel = supabase
      .channel("survey-responses-dashboard")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: tableName }, () => {
        loadResponses();
      })
      .subscribe();

    const interval = window.setInterval(loadResponses, 10000);

    return () => {
      window.clearTimeout(firstLoad);
      window.clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [loadResponses]);

  const aggregates = useMemo(() => getAggregates(responses), [responses]);
  const resourceInsights = useMemo(() => getResourceInsightData(), []);

  if (status === "loading") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Loader2 className="mx-auto animate-spin text-teal-700" size={30} aria-hidden="true" />
        <p className="mt-3 font-semibold text-slate-950">{text.loading}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-rose-950">
        <p className="flex items-center gap-2 font-semibold">
          <AlertCircle size={18} aria-hidden="true" />
          {text.errorTitle}
        </p>
        <p className="mt-2 text-sm leading-6">{text.errorBody}</p>
        <p className="mt-2 text-xs leading-5 opacity-80">{error}</p>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <Users className="mx-auto text-teal-700" size={34} aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-semibold text-slate-950">{text.emptyTitle}</h2>
        <p className="mx-auto mt-2 max-w-xl leading-7 text-slate-600">{text.emptyBody}</p>
          <LoadedStatus label={text.loadedStatus} count={responses.length} value={lastUpdated} language={language} className="justify-center" />
      </div>
    );
  }

  const scoreRows = [
    { label: text.comfort, value: aggregates.comfort_talking_home, icon: MessageCircleHeart },
    { label: text.help, value: aggregates.knows_where_to_get_help, icon: HeartHandshake },
    { label: text.barrier, value: aggregates.language_barrier, icon: Languages },
    { label: text.stigma, value: aggregates.stigma_score, icon: BarChart3 },
  ];

  const breakdownRows = [
    { label: text.bilingual, value: aggregates.bilingualToolPercent },
    { label: text.highBarrier, value: aggregates.highLanguageBarrierPercent },
    { label: text.lowComfort, value: aggregates.lowComfortPercent },
    { label: text.lowAwareness, value: aggregates.lowAwarenessPercent },
  ];
  const keyFindings = getKeyFindings(resourceInsights, aggregates, text);

  return (
    <div className="grid gap-6">
      <section className="relative overflow-hidden rounded-lg border border-teal-900/20 bg-[#061d1b] p-5 text-white shadow-[0_24px_80px_rgba(6,29,27,0.22)]">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="relative z-10 grid gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-teal-200">
                <Wifi size={17} aria-hidden="true" />
                {text.live}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">{text.snapshotTitle}</h2>
              <p className="mt-3 max-w-2xl leading-7 text-teal-50/85">{text.snapshotBody}</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-teal-50 shadow-sm backdrop-blur">
              <p>{text.realtime}</p>
          <LoadedStatus label={text.loadedStatus} count={aggregates.responseCount} value={lastUpdated} language={language} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <AnalyticsMetric icon={HeartHandshake} label={text.totalResources} value={String(resourceInsights.totalResources)} helper={text.sourceResources} />
            <AnalyticsMetric icon={Building2} label={text.citiesCovered} value={String(resourceInsights.citiesCovered)} helper={text.sourceResources} />
            <AnalyticsMetric icon={Languages} label={text.languagesSupported} value={String(resourceInsights.languagesSupported)} helper={text.sourceResources} />
            <AnalyticsMetric icon={Users} label={text.communityResponses} value={String(aggregates.responseCount)} helper={text.sourceSurvey} />
            <AnalyticsMetric icon={Clock3} label={text.lastUpdated} value={lastUpdated ? formatTime(lastUpdated, language) : "--"} helper={text.sourceCombined} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
        <article className="rounded-lg border border-teal-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">{text.executiveSignal}</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">{text.keyFindings}</h2>
            </div>
            <Sparkles className="text-teal-700" size={24} aria-hidden="true" />
          </div>
          <div className="mt-5 grid gap-3">
            {keyFindings.map((finding) => (
              <div key={finding.title} className="rounded-lg border border-slate-100 bg-[#f6faf7] p-4 transition hover:border-teal-200 hover:bg-teal-50">
                <p className="font-semibold text-slate-950">{finding.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{finding.body}</p>
              </div>
            ))}
          </div>
        </article>

        <DashboardChartPanel
          title={text.questionTitle}
          subtitle={text.questionSubtitle}
          explanation={text.questionExplain}
          source={text.sourceSurvey}
          values={scoreRows.map((row) => ({ label: row.label, value: formatScore(row.value), helper: text.scale }))}
        >
          <div className="grid gap-4">
            {scoreRows.map((row) => (
              <ScoreBar key={row.label} {...row} />
            ))}
          </div>
        </DashboardChartPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <DashboardChartPanel
          title={text.percentageTitle}
          subtitle={text.percentageSubtitle}
          explanation={text.percentageExplain}
          source={text.sourceSurvey}
          values={breakdownRows.map((row) => ({ label: row.label, value: `${row.value}%`, helper: text.percentHelp }))}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {breakdownRows.map((row) => (
              <PercentRing key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        </DashboardChartPanel>

        <DashboardChartPanel
          title={text.languageTitle}
          subtitle={text.languageSubtitle}
          explanation={text.languageExplain}
          source={text.sourceSurvey}
          values={aggregates.languageBreakdown.map((row) => ({ label: row.language || text.noLanguage, value: `${row.percent}%`, helper: `${row.count} ${text.responsesLabel}` }))}
        >
          <LanguageBreakdown rows={aggregates.languageBreakdown} noLanguage={text.noLanguage} responsesLabel={text.responsesLabel} />
        </DashboardChartPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <DashboardChartPanel
          title={text.resourceCityTitle}
          subtitle={text.resourceCitySubtitle}
          explanation={text.resourceCityExplain}
          source={text.sourceResources}
          values={resourceInsights.resourcesByCity.slice(0, 4).map((row) => ({ label: row.name, value: String(row.value), helper: "resources" }))}
        >
          <MiniBarChart data={resourceInsights.resourcesByCity} ariaLabel={text.resourceCityTitle} framed={false} />
        </DashboardChartPanel>

        <DashboardChartPanel
          title={text.categoryTitle}
          subtitle={text.categorySubtitle}
          explanation={text.categoryExplain}
          source={text.sourceResources}
          values={resourceInsights.resourcesByCategory.slice(0, 4).map((row) => ({ label: row.name, value: String(row.value), helper: "resources" }))}
        >
          <ResourceCategoryChart data={resourceInsights.resourcesByCategory} ariaLabel={text.categoryTitle} framed={false} />
        </DashboardChartPanel>

        <DashboardChartPanel
          title={text.accessTitle}
          subtitle={text.accessSubtitle}
          explanation={text.accessExplain}
          source={text.sourceResources}
          values={resourceInsights.resourcesByLanguage.slice(0, 4).map((row) => ({ label: row.name, value: String(row.value), helper: "resources" }))}
        >
          <LanguageAccessChart data={resourceInsights.resourcesByLanguage} ariaLabel={text.accessTitle} framed={false} />
        </DashboardChartPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardChartPanel
          title={text.coverageTitle}
          subtitle={text.coverageSubtitle}
          explanation={text.coverageExplain}
          source={text.sourceResources}
          values={[
            { label: text.citiesCovered, value: String(resourceInsights.citiesCovered), helper: text.sourceResources },
            { label: text.totalResources, value: String(resourceInsights.totalResources), helper: text.sourceResources },
          ]}
        >
          <ResourceCoverageMap
            data={resourceInsights.cityCoverage}
            ariaLabel={text.coverageTitle}
            summary={{
              totalResources: resourceInsights.totalResources,
              citiesCovered: resourceInsights.focusCitiesCovered,
              languagesSupported: resourceInsights.languagesSupported,
            }}
            labels={{
              title: text.coverageTitle,
              resources: text.resourcesLabel,
              cities: text.citiesLabel,
              languages: text.languagesLabel,
              fewResources: text.fewResources,
              manyResources: text.manyResources,
              supportAvailable: text.supportAvailable,
              supportedLanguages: text.supportedLanguages,
              topCategories: text.topCategories,
              selectCity: text.selectCity,
              legend: text.legend,
            }}
          />
        </DashboardChartPanel>

        <DashboardChartPanel
          title={text.surveyTitle}
          subtitle={text.surveySubtitle}
          explanation={aggregates.submissionTrend.length > 0 ? text.surveyExplain : text.aggregateOnly}
          source={text.sourceSurvey}
          values={[{ label: text.communityResponses, value: String(aggregates.responseCount), helper: text.sourceSurvey }]}
        >
          {aggregates.submissionTrend.length > 0 ? (
            <TrendLineChart data={aggregates.submissionTrend} ariaLabel={text.surveyTrend} framed={false} />
          ) : (
            <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-slate-300 bg-[#f6faf7] p-6 text-center text-sm leading-6 text-slate-600">
              {text.aggregateOnly}
            </div>
          )}
        </DashboardChartPanel>
      </section>
    </div>
  );
}

function sortResponsesByCreatedAt(responses: SurveyResponse[]) {
  return [...responses].sort((a, b) => {
    const first = a.created_at ? Date.parse(a.created_at) : 0;
    const second = b.created_at ? Date.parse(b.created_at) : 0;
    return first - second;
  });
}

function getAggregates(responses: SurveyResponse[]) {
  const responseCount = responses.length;
  const average = (key: keyof Pick<
    SurveyResponse,
    "comfort_talking_home" | "knows_where_to_get_help" | "language_barrier" | "stigma_score"
  >) => {
    if (responseCount === 0) return 0;
    return responses.reduce((sum, response) => sum + Number(response[key] ?? 0), 0) / responseCount;
  };

  const percent = (predicate: (response: SurveyResponse) => boolean) =>
    responseCount === 0 ? 0 : Math.round((responses.filter(predicate).length / responseCount) * 100);

  const languageCounts = responses.reduce<Record<string, number>>((counts, response) => {
    const preferredLanguage = String(response.language ?? "").trim();
    counts[preferredLanguage] = (counts[preferredLanguage] ?? 0) + 1;
    return counts;
  }, {});

  return {
    responseCount,
    comfort_talking_home: average("comfort_talking_home"),
    knows_where_to_get_help: average("knows_where_to_get_help"),
    language_barrier: average("language_barrier"),
    stigma_score: average("stigma_score"),
    bilingualToolPercent: percent((response) => Number(response.would_use_bilingual_tool) >= 4),
    highLanguageBarrierPercent: percent((response) => Number(response.language_barrier) >= 4),
    lowComfortPercent: percent((response) => Number(response.comfort_talking_home) <= 2),
    lowAwarenessPercent: percent((response) => Number(response.knows_where_to_get_help) <= 2),
    trends: [
      trendValues(responses, "comfort_talking_home"),
      trendValues(responses, "knows_where_to_get_help"),
      trendValues(responses, "language_barrier"),
      trendValues(responses, "stigma_score"),
    ],
    submissionTrend: submissionTrend(responses),
    languageBreakdown: Object.entries(languageCounts)
      .map(([language, count]) => ({
        language,
        count,
        percent: responseCount === 0 ? 0 : Math.round((count / responseCount) * 100),
      }))
      .sort((a, b) => b.count - a.count || a.language.localeCompare(b.language)),
  };
}

function submissionTrend(responses: SurveyResponse[]): ChartDatum[] {
  const counts = responses.reduce<Record<string, number>>((acc, response) => {
    if (!response.created_at) return acc;
    const date = new Date(response.created_at);
    if (Number.isNaN(date.getTime())) return acc;
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function trendValues(
  responses: SurveyResponse[],
  key: keyof Pick<SurveyResponse, "comfort_talking_home" | "knows_where_to_get_help" | "language_barrier" | "stigma_score">,
) {
  return responses
    .map((response) => Number(response[key] ?? 0))
    .filter((value) => Number.isFinite(value))
    .slice(-6);
}

function AnalyticsMetric({ icon: Icon, label, value, helper }: { icon: LucideIcon; label: string; value: string; helper: string }) {
  return (
    <article className="rounded-lg border border-white/15 bg-white/10 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
      <Icon size={20} className="text-teal-200" aria-hidden="true" />
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
      <h3 className="mt-1 text-sm font-semibold text-teal-50">{label}</h3>
      <p className="mt-2 text-xs leading-5 text-teal-50/70">{helper}</p>
    </article>
  );
}

function DashboardChartPanel({
  title,
  subtitle,
  explanation,
  source,
  values,
  children,
}: {
  title: string;
  subtitle: string;
  explanation: string;
  source: string;
  values: { label: string; value: string; helper: string }[];
  children: ReactNode;
}) {
  return (
    <article className="rounded-lg border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-[0_18px_50px_rgba(15,118,110,0.14)]">
      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">{subtitle}</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-slate-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{explanation}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{source}</p>
        </div>
        <div className="grid min-w-44 gap-2">
          {values.slice(0, 4).map((item) => (
            <div key={`${item.label}-${item.value}`} className="rounded-md border border-slate-100 bg-[#f6faf7] px-3 py-2">
              <p className="text-xs font-semibold text-slate-500">{item.label}</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">{item.value}</p>
              <p className="text-xs text-slate-500">{item.helper}</p>
            </div>
          ))}
        </div>
      </div>
      {children}
    </article>
  );
}

function LoadedStatus({
  label,
  count,
  value,
  language,
  className = "",
}: {
  label: string;
  count: number;
  value: Date | null;
  language: string;
  className?: string;
}) {
  if (!value) return null;

  return (
    <p className={`flex items-center gap-1 text-xs text-teal-900/80 ${className}`}>
      <span>{label.replace("{count}", String(count))}</span>
      <time dateTime={value.toISOString()}>{new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short" }).format(value)}</time>
    </p>
  );
}

function ScoreBar({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  const percent = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 font-medium text-slate-800">
          <Icon size={17} className="text-teal-700" aria-hidden="true" />
          {label}
        </span>
        <span className="text-sm font-semibold text-slate-700">{formatScore(value)}</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-teal-600" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function PercentRing({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-[#f6faf7] p-4">
      <div
        className="grid size-16 shrink-0 place-items-center rounded-full text-sm font-bold text-teal-950"
        style={{ background: `conic-gradient(#0f766e ${value * 3.6}deg, #dbece6 0deg)` }}
        aria-label={`${label}: ${value}%`}
      >
        <span className="grid size-11 place-items-center rounded-full bg-white">{value}%</span>
      </div>
      <p className="font-medium text-slate-800">{label}</p>
    </div>
  );
}

function LanguageBreakdown({
  rows,
  noLanguage,
  responsesLabel,
}: {
  rows: { language: string; count: number; percent: number }[];
  noLanguage: string;
  responsesLabel: string;
}) {
  return (
    <div className="mt-5 grid gap-3">
      {rows.map((row) => (
        <div key={row.language || noLanguage} className="rounded-lg bg-[#f6faf7] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">{row.language || noLanguage}</p>
              <p className="mt-1 text-sm text-slate-600">
                {row.count} {responsesLabel}
              </p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-teal-800 shadow-sm">{row.percent}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-teal-600" style={{ width: `${row.percent}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatScore(value: number) {
  return value.toFixed(2);
}

function formatTime(value: Date, language: string) {
  return new Intl.DateTimeFormat(language, { hour: "numeric", minute: "2-digit" }).format(value);
}

function getKeyFindings(
  resourceInsights: ReturnType<typeof getResourceInsightData>,
  aggregates: ReturnType<typeof getAggregates>,
  text: {
    languagesSupported: string;
    citiesCovered: string;
    totalResources: string;
    mostSupportedLanguage: string;
    mostSupportedLanguageBody: string;
    highestConcentration: string;
    highestConcentrationBody: string;
    mostCommonFormat: string;
    mostCommonFormatBody: string;
    leadingCategory: string;
    leadingCategoryBody: string;
    bilingualSignal: string;
    bilingualSignalBody: string;
  },
) {
  const topLanguage = resourceInsights.resourcesByLanguage[0];
  const topCity = resourceInsights.resourcesByCity[0];
  const topFormat = resourceInsights.resourcesByFormat[0];
  const topCategory = resourceInsights.resourcesByCategory[0];

  return [
    {
      title: `${topLanguage?.name ?? text.languagesSupported}: ${text.mostSupportedLanguage}`,
      body: `${topLanguage?.value ?? 0} ${text.mostSupportedLanguageBody}`,
    },
    {
      title: `${topCity?.name ?? text.citiesCovered}: ${text.highestConcentration}`,
      body: `${topCity?.value ?? 0} ${text.highestConcentrationBody}`,
    },
    {
      title: `${topFormat?.name ?? "Hybrid"}: ${text.mostCommonFormat}`,
      body: `${topFormat?.value ?? 0} ${text.mostCommonFormatBody}`,
    },
    {
      title: `${topCategory?.name ?? text.totalResources}: ${text.leadingCategory}`,
      body: `${topCategory?.value ?? 0} ${text.leadingCategoryBody}`,
    },
    {
      title: `${aggregates.bilingualToolPercent}% ${text.bilingualSignal}`,
      body: text.bilingualSignalBody,
    },
  ];
}
