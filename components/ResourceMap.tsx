"use client";

import { useMemo, useState } from "react";
import { Crosshair, Filter, MapPinned, Radar, RotateCcw, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import {
  type AgeGroupFilter,
  type CostFilter,
  type LanguageFilter,
  type ServiceTypeFilter,
  ageGroupOptions,
  costOptions,
  languageOptions,
  resources,
  serviceTypeOptions,
} from "@/lib/resources";

const copy = {
  en: {
    filters: "Map filters",
    reset: "Reset",
    language: "Language",
    insurance: "Insurance / cost",
    age: "Age group",
    service: "Service type",
    live: "CA-45 resource grid",
    note: "Pins are approximate sample locations for demo planning. Verify details directly with providers.",
    selected: "Selected resource",
    noMatch: "No map resources match those filters.",
    access: "Accessibility",
  },
  vi: {
    filters: "Bộ lọc bản đồ",
    reset: "Đặt lại",
    language: "Ngôn ngữ",
    insurance: "Bảo hiểm / chi phí",
    age: "Nhóm tuổi",
    service: "Loại dịch vụ",
    live: "Lưới nguồn hỗ trợ CA-45",
    note: "Các điểm ghim là vị trí mẫu gần đúng cho bản demo. Hãy xác minh trực tiếp với nhà cung cấp.",
    selected: "Nguồn hỗ trợ đã chọn",
    noMatch: "Không có nguồn hỗ trợ phù hợp với bộ lọc.",
    access: "Tiếp cận",
  },
} as const;

export function ResourceMap() {
  const { language } = useLanguage();
  const text = copy[language];
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>("All languages");
  const [costFilter, setCostFilter] = useState<CostFilter>("All costs");
  const [ageFilter, setAgeFilter] = useState<AgeGroupFilter>("All age groups");
  const [serviceFilter, setServiceFilter] = useState<ServiceTypeFilter>("All service types");
  const [selectedName, setSelectedName] = useState(resources[0].name);

  const filtered = useMemo(
    () =>
      resources.filter((resource) => {
        const languageMatch = languageFilter === "All languages" || resource.languages.includes(languageFilter);
        const costMatch = costFilter === "All costs" || resource.costTypes.includes(costFilter);
        const ageMatch = ageFilter === "All age groups" || resource.ageGroups.includes(ageFilter) || resource.ageGroups.includes("All ages");
        const serviceMatch = serviceFilter === "All service types" || resource.serviceType === serviceFilter;
        return languageMatch && costMatch && ageMatch && serviceMatch;
      }),
    [ageFilter, costFilter, languageFilter, serviceFilter],
  );

  const selected = filtered.find((resource) => resource.name === selectedName) ?? filtered[0] ?? null;

  const reset = () => {
    setLanguageFilter("All languages");
    setCostFilter("All costs");
    setAgeFilter("All age groups");
    setServiceFilter("All service types");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-semibold text-slate-950">
            <Filter size={18} className="text-teal-700" aria-hidden="true" />
            {text.filters}
          </p>
          <button type="button" onClick={reset} className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:bg-teal-50">
            <RotateCcw size={14} aria-hidden="true" />
            {text.reset}
          </button>
        </div>
        <div className="grid gap-4">
          <Select label={text.language} value={languageFilter} options={languageOptions} onChange={setLanguageFilter} />
          <Select label={text.insurance} value={costFilter} options={costOptions} onChange={setCostFilter} />
          <Select label={text.age} value={ageFilter} options={ageGroupOptions} onChange={setAgeFilter} />
          <Select label={text.service} value={serviceFilter} options={serviceTypeOptions} onChange={setServiceFilter} />
        </div>
        <p className="mt-5 rounded-md bg-amber-50 p-3 text-sm leading-6 text-amber-950">{text.note}</p>
      </aside>

      <section className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-[#071f1d] p-4 text-white shadow-sm">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(45,212,191,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,.18)_1px,transparent_1px)] [background-size:34px_34px]" />
          <div className="relative z-10 mb-4 flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-teal-100">
              <Radar size={18} aria-hidden="true" />
              {text.live}
            </p>
            <span className="rounded-md bg-white/10 px-3 py-1 text-sm font-semibold">{filtered.length} pins</span>
          </div>
          <div className="relative z-10 h-[440px] rounded-lg border border-white/10 bg-teal-950/40">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" role="img" aria-label="Interactive CA-45 resource map">
              <path
                d="M22 16 C42 8 68 12 79 31 C88 47 75 65 61 78 C47 91 25 86 18 68 C10 48 10 24 22 16Z"
                fill="rgba(20,184,166,0.18)"
                stroke="rgba(153,246,228,0.75)"
                strokeWidth="0.8"
              />
              <path d="M27 60 C42 48 57 47 73 35" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" fill="none" />
              <path d="M35 20 C41 38 44 59 39 83" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" fill="none" />
            </svg>
            {filtered.map((resource) => (
              <button
                key={resource.name}
                type="button"
                onClick={() => setSelectedName(resource.name)}
                className={`absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-white shadow-lg transition hover:scale-110 ${
                  selected?.name === resource.name ? "border-white bg-rose-500" : "border-teal-100 bg-teal-500"
                }`}
                style={{ left: `${resource.coordinates.x}%`, top: `${resource.coordinates.y}%` }}
                aria-label={resource.name}
              >
                <MapPinned size={16} aria-hidden="true" />
              </button>
            ))}
            <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-teal-50 backdrop-blur">
              <p className="flex items-center gap-2 font-semibold">
                <Crosshair size={14} aria-hidden="true" />
                Little Saigon / Garden Grove / Westminster / Orange County
              </p>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          {selected ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">{text.selected}</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">{selected.name}</h2>
              <p className="mt-2 text-sm font-medium text-slate-600">{selected.city}</p>
              <p className="mt-4 leading-7 text-slate-700">{selected.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[...selected.languages, ...selected.costTypes, ...selected.ageGroups].map((tag) => (
                  <span key={tag} className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-900">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 rounded-lg bg-[#f6faf7] p-4">
                <p className="flex items-center gap-2 font-semibold text-slate-950">
                  <ShieldCheck size={17} className="text-teal-700" aria-hidden="true" />
                  {text.access}
                </p>
                <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-600">
                  {selected.accessibility.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="leading-7 text-slate-600">{text.noMatch}</p>
          )}
        </aside>
      </section>
    </div>
  );
}

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-800">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
