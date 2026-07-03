"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart3, BookOpen, ClipboardCheck, MessageCircleHeart, Search } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { readLocalImpact, type LocalImpactMetrics } from "@/lib/impact";
import { supabase } from "@/lib/supabase";

export function ImpactMetrics() {
  const { t } = useLanguage();
  const [local, setLocal] = useState<LocalImpactMetrics>({ resourcesViewed: 0, conversationsPracticed: 0, quizzesCompleted: 0 });
  const [submissions, setSubmissions] = useState(0);

  const refresh = useCallback(async () => {
    setLocal(readLocalImpact());
    const { count } = await supabase.from("survey_responses").select("*", { count: "exact", head: true });
    setSubmissions(count ?? 0);
  }, []);

  useEffect(() => {
    const firstLoad = window.setTimeout(refresh, 0);
    window.addEventListener("cau-noi-impact-updated", refresh);
    const interval = window.setInterval(refresh, 30000);
    return () => {
      window.clearTimeout(firstLoad);
      window.removeEventListener("cau-noi-impact-updated", refresh);
      window.clearInterval(interval);
    };
  }, [refresh]);

  const metrics = [
    { label: t("impact.resources"), value: local.resourcesViewed, icon: Search },
    { label: t("impact.conversations"), value: local.conversationsPracticed, icon: MessageCircleHeart },
    { label: t("impact.quizzes"), value: local.quizzesCompleted, icon: ClipboardCheck },
    { label: t("impact.submissions"), value: submissions, icon: BarChart3 },
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-slate-950">{t("impact.title")}</h2>
        <p className="mt-2 leading-7 text-slate-600">{t("impact.intro")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-lg border border-slate-200 bg-[#f6faf7] p-5">
            <metric.icon size={22} className="text-teal-700" aria-hidden="true" />
            <p className="mt-4 text-3xl font-semibold text-slate-950">{metric.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-600">{metric.label}</p>
          </article>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
        <BookOpen size={14} aria-hidden="true" />
        {t("impact.aggregate")}
      </p>
    </section>
  );
}
