"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  HeartHandshake,
  Languages,
  Loader2,
  MessageCircleHeart,
  Radar,
  Users,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
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
        <LoadedStatus count={responses.length} value={lastUpdated} language={language} className="justify-center" />
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

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 rounded-lg border border-teal-200 bg-teal-50 p-4 text-teal-950 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 font-semibold">
          <Wifi size={18} aria-hidden="true" />
          {text.live}
        </p>
        <div className="grid gap-1 text-sm sm:text-right">
          <p>{text.realtime}</p>
          <LoadedStatus count={aggregates.responseCount} value={lastUpdated} language={language} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryCard icon={Users} label={text.total} value={String(aggregates.responseCount)} helper={text.aggregateHelper} />
        {scoreRows.map((row) => (
          <SummaryCard key={row.label} icon={row.icon} label={row.label} value={formatScore(row.value)} helper={text.scale} />
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">{text.averages}</h2>
              <p className="mt-1 text-sm text-slate-600">{text.scale}</p>
            </div>
            <Radar className="text-teal-700" size={24} aria-hidden="true" />
          </div>
          <div className="grid gap-4">
            {scoreRows.map((row) => (
              <ScoreBar key={row.label} {...row} />
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-950">{text.breakdowns}</h2>
            <p className="mt-1 text-sm text-slate-600">{text.percentHelp}</p>
          </div>
          <div className="grid gap-4">
            {breakdownRows.map((row) => (
              <PercentRing key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">{text.languageBreakdown}</h2>
          <LanguageBreakdown rows={aggregates.languageBreakdown} noLanguage={text.noLanguage} responsesLabel={text.responsesLabel} />
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">{text.insights}</h2>
          <p className="mt-1 text-sm text-slate-600">{text.aggregateOnly}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {scoreRows.map((row, index) => (
              <MiniTrend key={row.label} label={row.label} values={aggregates.trends[index]} />
            ))}
          </div>
        </article>
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
    languageBreakdown: Object.entries(languageCounts)
      .map(([language, count]) => ({
        language,
        count,
        percent: responseCount === 0 ? 0 : Math.round((count / responseCount) * 100),
      }))
      .sort((a, b) => b.count - a.count || a.language.localeCompare(b.language)),
  };
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

function SummaryCard({ icon: Icon, label, value, helper }: { icon: LucideIcon; label: string; value: string; helper: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Icon size={22} className="text-teal-700" aria-hidden="true" />
      <p className="mt-4 text-3xl font-semibold text-slate-950">{value}</p>
      <h2 className="mt-1 font-semibold text-slate-800">{label}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{helper}</p>
    </article>
  );
}

function LoadedStatus({
  count,
  value,
  language,
  className = "",
}: {
  count: number;
  value: Date | null;
  language: string;
  className?: string;
}) {
  if (!value) return null;

  return (
    <p className={`flex items-center gap-1 text-xs text-teal-900/80 ${className}`}>
      <span>Loaded {count} survey responses · Last updated</span>
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

function MiniTrend({ label, values }: { label: string; values: number[] }) {
  const displayValues = values.length === 1 ? [values[0], values[0]] : values;
  const points = displayValues.map((point, pointIndex) => {
    const x = displayValues.length === 1 ? 0 : (pointIndex / Math.max(1, displayValues.length - 1)) * 100;
    const y = 70 - point * 12;
    return `${x},${Math.max(12, Math.min(68, y))}`;
  });

  return (
    <div className="rounded-lg bg-[#f6faf7] p-4">
      <p className="mb-3 text-sm font-semibold text-slate-800">{label}</p>
      <svg viewBox="0 0 100 80" className="h-24 w-full" role="img" aria-label={`${label} trend visualization`}>
        <polyline fill="none" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points.join(" ")} />
        <circle cx="100" cy={points.at(-1)?.split(",")[1]} r="4" fill="#0f766e" />
      </svg>
    </div>
  );
}

function formatScore(value: number) {
  return value.toFixed(2);
}
