"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BarChart3, HeartHandshake, Languages, Loader2, MessageCircleHeart, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase, type SurveyResponse } from "@/lib/supabase";

type DashboardStatus = "loading" | "ready" | "empty" | "error";

const dashboardCopy = {
  en: {
    loading: "Loading anonymous survey data...",
    errorTitle: "Dashboard data could not load",
    emptyTitle: "No anonymous responses yet",
    emptyBody:
      "Once students or families submit the stigma quiz, this dashboard will show aggregate trends here. No names, emails, phone numbers, school names, or IP addresses are displayed.",
    responses: "Anonymous responses",
    responsesHelp: "Total rows in survey_responses.",
    bilingual: "Would use bilingual tool",
    bilingualHelp: "Percent who agreed or strongly agreed.",
    avgStigma: "Average stigma score",
    avgStigmaHelp: "Lower scores suggest lower stigma agreement.",
    averageScores: "Average scores",
    scale: "Scores use a 1-5 Likert scale.",
    aggregateOnly: "Aggregate only",
    preferredLanguage: "Preferred language",
    ageGroup: "Age group",
    metrics: {
      comfort_talking_home: ["Comfort talking at home", "Average response to feeling comfortable discussing mental health at home."],
      knows_where_to_get_help: ["Knows where to get help", "Average confidence in finding mental-health support."],
      language_barrier: ["Language barrier", "Average agreement that language makes access harder."],
      stigma_score: ["Stigma score", "Average stigma agreement score across stigma prompts."],
    },
  },
  vi: {
    loading: "Đang tải dữ liệu khảo sát ẩn danh...",
    errorTitle: "Không tải được dữ liệu bảng thông tin",
    emptyTitle: "Chưa có phản hồi ẩn danh",
    emptyBody:
      "Khi học sinh hoặc gia đình gửi khảo sát định kiến, bảng này sẽ hiển thị xu hướng tổng hợp. Không hiển thị tên, email, số điện thoại, tên trường, hoặc địa chỉ IP.",
    responses: "Phản hồi ẩn danh",
    responsesHelp: "Tổng số dòng trong survey_responses.",
    bilingual: "Sẽ dùng công cụ song ngữ",
    bilingualHelp: "Tỷ lệ người đồng ý hoặc rất đồng ý.",
    avgStigma: "Điểm định kiến trung bình",
    avgStigmaHelp: "Điểm thấp hơn cho thấy mức đồng ý với định kiến thấp hơn.",
    averageScores: "Điểm trung bình",
    scale: "Điểm dùng thang Likert từ 1 đến 5.",
    aggregateOnly: "Chỉ dữ liệu tổng hợp",
    preferredLanguage: "Ngôn ngữ ưu tiên",
    ageGroup: "Nhóm tuổi",
    metrics: {
      comfort_talking_home: ["Thoải mái nói chuyện ở nhà", "Mức trung bình về sự thoải mái khi nói về sức khỏe tinh thần ở nhà."],
      knows_where_to_get_help: ["Biết nơi tìm hỗ trợ", "Mức trung bình về sự tự tin khi tìm hỗ trợ sức khỏe tinh thần."],
      language_barrier: ["Rào cản ngôn ngữ", "Mức trung bình về việc ngôn ngữ làm cho tiếp cận hỗ trợ khó hơn."],
      stigma_score: ["Điểm định kiến", "Điểm trung bình về mức đồng ý với các câu định kiến."],
    },
  },
} as const;

const scoreMetrics = [
  { key: "comfort_talking_home", icon: MessageCircleHeart },
  { key: "knows_where_to_get_help", icon: HeartHandshake },
  { key: "language_barrier", icon: Languages },
  { key: "stigma_score", icon: BarChart3 },
] as const;

export function DashboardView() {
  const { language } = useLanguage();
  const copy = dashboardCopy[language];
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadResponses() {
      setStatus("loading");
      setError("");

      const { data, error: readError } = await supabase
        .from("survey_responses")
        .select(
          "age_group, language, comfort_talking_home, knows_where_to_get_help, language_barrier, stigma_score, would_use_bilingual_tool",
        );

      if (!active) return;

      if (readError) {
        setStatus("error");
        setError(readError.message);
        return;
      }

      const nextResponses = (data ?? []) as SurveyResponse[];
      setResponses(nextResponses);
      setStatus(nextResponses.length === 0 ? "empty" : "ready");
    }

    loadResponses();

    return () => {
      active = false;
    };
  }, []);

  const aggregates = useMemo(() => getAggregates(responses), [responses]);

  if (status === "loading") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Loader2 className="mx-auto animate-spin text-teal-700" size={30} aria-hidden="true" />
        <p className="mt-3 font-semibold text-slate-950">{copy.loading}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-rose-950">
        <p className="flex items-center gap-2 font-semibold">
          <AlertCircle size={18} aria-hidden="true" />
          {copy.errorTitle}
        </p>
        <p className="mt-2 text-sm leading-6">{error}</p>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <Users className="mx-auto text-teal-700" size={34} aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-semibold text-slate-950">{copy.emptyTitle}</h2>
        <p className="mx-auto mt-2 max-w-xl leading-7 text-slate-600">{copy.emptyBody}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          icon={Users}
          label={copy.responses}
          value={String(aggregates.responseCount)}
          helper={copy.responsesHelp}
        />
        <SummaryCard
          icon={Languages}
          label={copy.bilingual}
          value={`${aggregates.bilingualToolPercent}%`}
          helper={copy.bilingualHelp}
        />
        <SummaryCard
          icon={BarChart3}
          label={copy.avgStigma}
          value={formatScore(aggregates.stigma_score)}
          helper={copy.avgStigmaHelp}
        />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">{copy.averageScores}</h2>
            <p className="mt-1 text-sm text-slate-600">{copy.scale}</p>
          </div>
          <span className="w-fit rounded-md bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-800">
            {copy.aggregateOnly}
          </span>
        </div>

        <div className="grid gap-4">
          {scoreMetrics.map((metric) => (
            <ScoreBar
              key={metric.key}
              label={copy.metrics[metric.key][0]}
              helper={copy.metrics[metric.key][1]}
              value={aggregates[metric.key]}
              icon={metric.icon}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DistributionChart
          title={copy.preferredLanguage}
          rows={getDistribution(responses.map((response) => response.language))}
        />
        <DistributionChart
          title={copy.ageGroup}
          rows={getDistribution(responses.map((response) => response.age_group))}
        />
      </section>
    </div>
  );
}

function getAggregates(responses: SurveyResponse[]) {
  const responseCount = responses.length;
  const average = (key: keyof Pick<
    SurveyResponse,
    "comfort_talking_home" | "knows_where_to_get_help" | "language_barrier" | "stigma_score"
  >) => {
    if (responseCount === 0) return 0;
    const total = responses.reduce((sum, response) => sum + Number(response[key] ?? 0), 0);
    return total / responseCount;
  };

  const wouldUseCount = responses.filter((response) => Number(response.would_use_bilingual_tool) >= 4).length;

  return {
    responseCount,
    comfort_talking_home: average("comfort_talking_home"),
    knows_where_to_get_help: average("knows_where_to_get_help"),
    language_barrier: average("language_barrier"),
    stigma_score: average("stigma_score"),
    bilingualToolPercent: responseCount === 0 ? 0 : Math.round((wouldUseCount / responseCount) * 100),
  };
}

function getDistribution(values: string[]) {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    const label = value || "Not specified";
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});

  const total = values.length || 1;

  return Object.entries(counts)
    .map(([label, count]) => ({
      label,
      count,
      percent: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Icon size={22} className="text-teal-700" aria-hidden="true" />
      <p className="mt-4 text-3xl font-semibold text-slate-950">{value}</p>
      <h2 className="mt-1 font-semibold text-slate-800">{label}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{helper}</p>
    </article>
  );
}

function ScoreBar({
  icon: Icon,
  label,
  helper,
  value,
}: {
  icon: LucideIcon;
  label: string;
  helper: string;
  value: number;
}) {
  const percent = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <article className="rounded-lg bg-[#f6faf7] p-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-teal-700">
            <Icon size={19} aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-semibold text-slate-950">{label}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{helper}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-md bg-white px-2.5 py-1 text-sm font-semibold text-slate-800">
          {formatScore(value)}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-teal-600" style={{ width: `${percent}%` }} />
      </div>
    </article>
  );
}

function DistributionChart({ title, rows }: { title: string; rows: { label: string; count: number; percent: number }[] }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-5 grid gap-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between gap-4 text-sm">
              <span className="font-medium text-slate-800">{row.label}</span>
              <span className="text-slate-500">
                {row.count} · {row.percent}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-teal-600" style={{ width: `${row.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function formatScore(value: number) {
  return value.toFixed(2);
}
