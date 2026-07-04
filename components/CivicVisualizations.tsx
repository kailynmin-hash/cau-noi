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
import type { ChartDatum } from "@/lib/resourceInsights";

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

export function ResourceCoverageMap({ data, ariaLabel }: { data: { city: string; count: number }[]; ariaLabel: string }) {
  const max = Math.max(...data.map((item) => item.count), 1);
  const plotted = useMemo(
    () =>
      data.map((item, index) => ({
        ...item,
        left: 12 + ((index * 23) % 76),
        top: 18 + ((index * 31) % 62),
      })),
    [data],
  );

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="relative min-h-80 overflow-hidden rounded-lg border border-teal-900/20 bg-[#062522] p-5 text-white shadow-sm"
    >
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative z-10 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-100">CA-45 coverage</p>
        <MapPin size={20} className="text-teal-200" aria-hidden="true" />
      </div>
      {plotted.map((item) => {
        const size = 14 + (item.count / max) * 28;
        return (
          <div
            key={item.city}
            className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${item.left}%`, top: `${item.top}%` }}
          >
            <span
              className="block rounded-full border-2 border-white bg-teal-400 shadow-[0_0_28px_rgba(45,212,191,0.55)] transition duration-300 group-hover:scale-125 group-hover:bg-rose-400"
              style={{ width: size, height: size }}
            />
            <span className="pointer-events-none absolute left-1/2 top-full mt-2 w-40 -translate-x-1/2 rounded-md border border-white/10 bg-white/95 px-3 py-2 text-center text-xs font-semibold text-slate-900 shadow-xl backdrop-blur transition group-hover:scale-105">
              {item.city}: {item.count}
            </span>
          </div>
        );
      })}
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
