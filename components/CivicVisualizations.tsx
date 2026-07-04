"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Info, MapPin } from "lucide-react";
import type { ChartDatum, CityCoverageDatum } from "@/lib/resourceInsights";

const palette = ["#0f766e", "#14b8a6", "#38bdf8", "#f43f5e", "#f59e0b", "#8b5cf6", "#22c55e", "#64748b"];

export function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 700;
    const start = performance.now();
    const frame = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(value * progress));
      if (progress < 1) requestAnimationFrame(frame);
    };
    const id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

export function StatCard({ label, value, helper, icon }: { label: string; value: number | string; helper: string; icon?: ReactNode }) {
  return (
    <article className="group rounded-lg border border-teal-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-[0_18px_50px_rgba(15,118,110,0.16)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-600">{label}</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950">
            {typeof value === "number" ? <AnimatedCounter value={value} /> : value}
          </p>
        </div>
        {icon ? <div className="rounded-lg bg-teal-50 p-2 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">{icon}</div> : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{helper}</p>
    </article>
  );
}

export function InsightCard({ title, body, sourceName, sourceUrl }: { title: string; body: string; sourceName?: string; sourceUrl?: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-lg">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700">
          <Info size={17} aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-semibold text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
          {sourceName && sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm font-semibold text-teal-800 hover:text-teal-950">
              {sourceName}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function MiniBarChart({ data, ariaLabel, framed = true }: { data: ChartDatum[]; ariaLabel: string; framed?: boolean }) {
  const chartData = data.slice(0, 8);
  return (
    <ChartFrame ariaLabel={ariaLabel} framed={framed}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
          <CartesianGrid stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={112} tick={{ fontSize: 12, fill: "#334155" }} />
          <Tooltip cursor={{ fill: "#f0fdfa" }} contentStyle={{ borderRadius: 8, borderColor: "#99f6e4" }} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#0f766e" />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function LanguageAccessChart({ data, ariaLabel, framed = true }: { data: ChartDatum[]; ariaLabel: string; framed?: boolean }) {
  const chartData = data.slice(0, 8);
  return (
    <ChartFrame ariaLabel={ariaLabel} framed={framed}>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ left: 4, right: 16, top: 8, bottom: 8 }}>
          <defs>
            <linearGradient id="languageAccess" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#334155" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#334155" }} />
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#99f6e4" }} />
          <Area type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={3} fill="url(#languageAccess)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function ResourceCategoryChart({ data, ariaLabel, framed = true }: { data: ChartDatum[]; ariaLabel: string; framed?: boolean }) {
  const chartData = data.slice(0, 8);
  return (
    <ChartFrame ariaLabel={ariaLabel} framed={framed}>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#99f6e4" }} />
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={92} paddingAngle={3}>
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={palette[index % palette.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function TrendLineChart({ data, ariaLabel, framed = true }: { data: ChartDatum[]; ariaLabel: string; framed?: boolean }) {
  return (
    <ChartFrame ariaLabel={ariaLabel} framed={framed}>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ left: 4, right: 16, top: 8, bottom: 8 }}>
          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#334155" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#334155" }} />
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#99f6e4" }} />
          <Line type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={3} dot={{ r: 4, fill: "#0f766e" }} activeDot={{ r: 7 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

const coveragePositions = [
  { left: 18, top: 24 },
  { left: 42, top: 18 },
  { left: 66, top: 25 },
  { left: 84, top: 18 },
  { left: 24, top: 48 },
  { left: 50, top: 44 },
  { left: 74, top: 50 },
  { left: 16, top: 72 },
  { left: 38, top: 68 },
  { left: 60, top: 74 },
  { left: 82, top: 70 },
  { left: 50, top: 88 },
];

type CoverageLabels = {
  title?: string;
  resources?: string;
  cities?: string;
  languages?: string;
  fewResources?: string;
  manyResources?: string;
  supportAvailable?: string;
  supportedLanguages?: string;
  topCategories?: string;
  selectCity?: string;
  legend?: string;
};

export function ResourceCoverageMap({
  data,
  ariaLabel,
  summary,
  labels,
}: {
  data: CityCoverageDatum[];
  ariaLabel: string;
  summary?: {
    totalResources: number | string;
    citiesCovered: number | string;
    languagesSupported: number | string;
  };
  labels?: CoverageLabels;
}) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const max = Math.max(...data.map((item) => item.count), 1);
  const activeCity = data.find((item) => item.city === selectedCity);
  const text = {
    title: labels?.title ?? "CA-45 Coverage",
    resources: labels?.resources ?? "Resources",
    cities: labels?.cities ?? "Cities covered",
    languages: labels?.languages ?? "Languages",
    fewResources: labels?.fewResources ?? "Few resources",
    manyResources: labels?.manyResources ?? "Many resources",
    supportAvailable: labels?.supportAvailable ?? "Mental Health Support Available",
    supportedLanguages: labels?.supportedLanguages ?? "Supported languages",
    topCategories: labels?.topCategories ?? "Top categories",
    selectCity: labels?.selectCity ?? "Select a city to view coverage details.",
    legend: labels?.legend ?? "Legend",
  };
  const plotted = useMemo(
    () =>
      data.map((item, index) => ({
        ...item,
        ...coveragePositions[index % coveragePositions.length],
      })),
    [data],
  );

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="relative overflow-hidden rounded-lg border border-teal-900/20 bg-[#062522] p-4 text-white shadow-sm sm:p-5"
    >
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative z-10 rounded-lg border border-white/10 bg-white/10 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-100">{text.title}</p>
          <MapPin size={20} className="text-teal-200" aria-hidden="true" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <CoverageStat label={text.resources} value={summary?.totalResources ?? data.reduce((total, item) => total + item.count, 0)} />
          <CoverageStat label={text.cities} value={summary?.citiesCovered ?? data.filter((item) => item.count > 0).length} />
          <CoverageStat
            label={text.languages}
            value={summary?.languagesSupported ?? new Set(data.flatMap((item) => item.languages)).size}
          />
        </div>
      </div>

      <div className="relative z-10 mt-5 min-h-[360px] rounded-lg border border-white/10 bg-slate-950/20 sm:min-h-[420px]">
        <div className="absolute inset-5 rounded-[2rem] border border-teal-300/10" />
        <div className="absolute inset-12 rounded-[2.5rem] border border-teal-300/10" />
        <div className="absolute left-6 right-6 top-1/2 h-px bg-teal-100/10" />
        <div className="absolute bottom-6 top-6 left-1/2 w-px bg-teal-100/10" />
        {plotted.map((item) => {
          const size = 16 + (item.count / max) * 32;
          const isSelected = selectedCity === item.city;
          const alignClass = item.left > 72 ? "right-0 translate-x-0" : item.left < 28 ? "left-0 translate-x-0" : "left-1/2 -translate-x-1/2";
          const verticalClass = item.top > 66 ? "bottom-full mb-3" : "top-full mt-3";

          return (
            <button
              key={item.city}
              type="button"
              aria-label={`${item.city}, ${item.count} ${text.resources}`}
              onClick={() => setSelectedCity(item.city)}
              onFocus={() => setSelectedCity(item.city)}
              className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none transition duration-300 hover:scale-110 focus-visible:scale-110 focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#062522]"
              style={{ left: `${item.left}%`, top: `${item.top}%`, width: size, height: size }}
            >
              <span
                className={`absolute inset-0 rounded-full border-2 border-white shadow-[0_0_28px_rgba(45,212,191,0.55)] transition duration-300 ${
                  isSelected ? "bg-rose-400 shadow-[0_0_36px_rgba(251,113,133,0.72)]" : "bg-teal-400 group-hover:bg-rose-400 group-focus-visible:bg-rose-400"
                }`}
              />
              <span className="absolute inset-[-10px] rounded-full bg-teal-300/10 opacity-0 blur-md transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
              <span
                className={`pointer-events-none absolute w-56 rounded-lg border border-teal-100/40 bg-white px-4 py-3 text-left text-slate-950 opacity-0 shadow-2xl shadow-black/30 backdrop-blur transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 ${
                  isSelected ? "translate-y-0 opacity-100" : "translate-y-1"
                } ${alignClass} ${verticalClass}`}
              >
                <span className="block text-sm font-semibold">{item.city}</span>
                <span className="mt-1 block text-xs font-semibold text-teal-800">
                  {item.count} {text.resources}
                </span>
                <span className="mt-1 block text-xs text-slate-600">{text.supportAvailable}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative z-10 mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-100">{text.legend}</p>
          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-teal-50">
            <span className="inline-flex items-center gap-2">
              <span className="size-3 rounded-full border border-white bg-teal-400" />
              {text.fewResources}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-8 rounded-full border-2 border-white bg-teal-400 shadow-[0_0_24px_rgba(45,212,191,0.55)]" />
              {text.manyResources}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/95 p-4 text-slate-950 shadow-xl">
          {activeCity ? (
            <>
              <p className="text-sm font-semibold text-teal-800">{activeCity.city}</p>
              <p className="mt-1 text-2xl font-semibold">{activeCity.count} {text.resources}</p>
              <p className="mt-3 text-sm font-semibold text-slate-700">{text.supportedLanguages}</p>
              <p className="mt-1 text-sm text-slate-600">{activeCity.languages.length > 0 ? activeCity.languages.join(", ") : text.selectCity}</p>
              <p className="mt-3 text-sm font-semibold text-slate-700">{text.topCategories}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeCity.categories.length > 0 ? (
                  activeCity.categories.map((category) => (
                    <span key={category.name} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                      {category.name} · {category.value}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-600">{text.selectCity}</span>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-600">{text.selectCity}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CoverageStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/20 px-4 py-3">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-100">{label}</p>
    </div>
  );
}

function ChartFrame({ children, ariaLabel, framed }: { children: ReactNode; ariaLabel: string; framed: boolean }) {
  if (!framed) return <div aria-label={ariaLabel}>{children}</div>;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-200 hover:shadow-lg" aria-label={ariaLabel}>
      {children}
    </div>
  );
}
