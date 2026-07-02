"use client";

import { useMemo, useState } from "react";
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
  Tags,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { incrementImpact } from "@/lib/impact";
import {
  type CostFilter,
  type LanguageFilter,
  type ModeFilter,
  type ResourceTypeFilter,
  costOptions,
  languageOptions,
  modeOptions,
  resourceTypeOptions,
  resources,
} from "@/lib/resources";

const finderCopy = {
  en: {
    filters: "Filters",
    reset: "Reset",
    language: "Language",
    cost: "Cost",
    type: "Resource type",
    mode: "In-person or virtual",
    privateNote: "No search terms or personal details are saved. Filters only change what appears on this screen.",
    verifyNote: "Verify hours, eligibility, cost, and language access directly with providers before seeking care.",
    title: "CA-45 and Orange County resource finder",
    showing: "Showing",
    of: "of",
    resources: "resources",
    anonymous: "Anonymous browsing",
    phone: "Phone",
    languages: "Languages",
    format: "Format",
    access: "Access",
    website: "Website / info",
    websiteComingSoon: "Website coming soon",
    call: "Call",
    emptyTitle: "No resources match those filters.",
    emptyBody: "Try resetting filters or selecting a broader resource type.",
  },
  vi: {
    filters: "Bộ lọc",
    reset: "Đặt lại",
    language: "Ngôn ngữ",
    cost: "Chi phí",
    type: "Loại nguồn hỗ trợ",
    mode: "Trực tiếp hoặc trực tuyến",
    privateNote: "Không lưu từ khóa tìm kiếm hoặc thông tin cá nhân. Bộ lọc chỉ thay đổi nội dung hiển thị trên màn hình này.",
    verifyNote: "Hãy xác minh giờ làm việc, điều kiện, chi phí, và hỗ trợ ngôn ngữ trực tiếp với nhà cung cấp trước khi tìm sự chăm sóc.",
    title: "Tìm nguồn hỗ trợ tại CA-45 và Orange County",
    showing: "Đang hiển thị",
    of: "trong",
    resources: "nguồn hỗ trợ",
    anonymous: "Xem ẩn danh",
    phone: "Điện thoại",
    languages: "Ngôn ngữ",
    format: "Hình thức",
    access: "Tiếp cận",
    website: "Trang web / thông tin",
    websiteComingSoon: "Sắp có trang web",
    call: "Gọi",
    emptyTitle: "Không có nguồn hỗ trợ phù hợp với bộ lọc.",
    emptyBody: "Hãy đặt lại bộ lọc hoặc chọn loại nguồn hỗ trợ rộng hơn.",
  },
} as const;

export function ResourceFinder() {
  const { language: appLanguage } = useLanguage();
  const copy = finderCopy[appLanguage];
  const [language, setLanguage] = useState<LanguageFilter>("All languages");
  const [cost, setCost] = useState<CostFilter>("All costs");
  const [resourceType, setResourceType] = useState<ResourceTypeFilter>("All resource types");
  const [mode, setMode] = useState<ModeFilter>("Any format");

  const filteredResources = useMemo(
    () =>
      resources.filter((resource) => {
        const languageMatches = language === "All languages" || resource.languages.includes(language);
        const costMatches = cost === "All costs" || resource.costTypes.includes(cost);
        const typeMatches = resourceType === "All resource types" || resource.resourceType === resourceType;
        const modeMatches =
          mode === "Any format" ||
          resource.mode === mode ||
          (mode !== "In-Person and Virtual" && resource.mode === "In-Person and Virtual");
        return languageMatches && costMatches && typeMatches && modeMatches;
      }),
    [cost, language, mode, resourceType],
  );

  const resetFilters = () => {
    setLanguage("All languages");
    setCost("All costs");
    setResourceType("All resource types");
    setMode("Any format");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold text-slate-950">
            <Filter size={18} className="text-teal-700" aria-hidden="true" />
            {copy.filters}
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 transition hover:bg-teal-50"
          >
            <RotateCcw size={14} aria-hidden="true" />
            {copy.reset}
          </button>
        </div>

        <div className="grid gap-4">
          <FilterSelect label={copy.language} value={language} options={languageOptions} onChange={setLanguage} />
          <FilterSelect label={copy.cost} value={cost} options={costOptions} onChange={setCost} />
          <FilterSelect label={copy.type} value={resourceType} options={resourceTypeOptions} onChange={setResourceType} />
          <FilterSelect label={copy.mode} value={mode} options={modeOptions} onChange={setMode} />
        </div>

        <p className="mt-5 rounded-md bg-[#f6faf7] p-3 text-sm leading-6 text-slate-600">
          {copy.privateNote}
        </p>
        <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          {copy.verifyNote}
        </p>
      </aside>

      <section aria-label="Resource results">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">{copy.title}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {copy.showing} {filteredResources.length} {copy.of} {resources.length} {copy.resources}
            </p>
          </div>
          <span className="w-fit rounded-md bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-800">
            {copy.anonymous}
          </span>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredResources.map((resource) => (
              <article key={resource.name} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                      {resource.resourceType}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                      <MapPin size={16} aria-hidden="true" />
                      {resource.city}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950">{resource.name}</h3>
                  </div>
                  <span className="w-fit rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {resource.mode}
                  </span>
                </div>

                <p className="mb-5 leading-7 text-slate-700">{resource.description}</p>

                <dl className="grid gap-3 text-sm text-slate-700">
                  <ResourceMeta icon={<Phone size={16} aria-hidden="true" />} label={copy.phone} value={resource.phone} />
                  <ResourceMeta
                    icon={<Languages size={16} aria-hidden="true" />}
                    label={copy.languages}
                    value={resource.languages.join(", ")}
                  />
                  <ResourceMeta
                    icon={<MonitorSmartphone size={16} aria-hidden="true" />}
                    label={copy.format}
                    value={resource.mode}
                  />
                  <ResourceMeta
                    icon={<Accessibility size={16} aria-hidden="true" />}
                    label={copy.access}
                    value={resource.accessibility.join("; ")}
                  />
                </dl>

                <div className="mt-4 flex flex-wrap gap-2" aria-label={`${resource.name} cost options`}>
                  {resource.costTypes.map((costType) => (
                    <span
                      key={costType}
                      className="rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-900"
                    >
                      {costType}
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
                  {resource.url ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => incrementImpact("resourcesViewed")}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                    >
                      {copy.website}
                      <ExternalLink size={16} aria-hidden="true" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-md bg-slate-200 px-4 text-sm font-semibold text-slate-500"
                    >
                      {copy.websiteComingSoon}
                    </button>
                  )}
                  {!resource.phone.toLowerCase().includes("placeholder") && !resource.phone.toLowerCase().includes("ask school") && (
                    <a
                      href={`tel:${resource.phone.replace(/[^\d]/g, "") || resource.phone}`}
                      onClick={() => incrementImpact("resourcesViewed")}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-teal-700 px-4 text-sm font-semibold text-teal-800 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100"
                    >
                      {copy.call}
                      <Phone size={16} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-950">{copy.emptyTitle}</h3>
            <p className="mt-2 text-sm text-slate-600">{copy.emptyBody}</p>
          </div>
        )}
      </section>
    </div>
  );
}

function FilterSelect<T extends string>({
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

function ResourceMeta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="flex min-w-24 items-center gap-1.5 font-semibold text-slate-950">
        <span className="text-teal-700">{icon}</span>
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}
