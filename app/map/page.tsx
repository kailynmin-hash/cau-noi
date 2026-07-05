"use client";

import dynamic from "next/dynamic";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";

const ResourceMap = dynamic(() => import("@/components/ResourceMap").then((mod) => mod.ResourceMap), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-[560px] place-items-center rounded-lg border border-teal-900/20 bg-[#061d1b] p-8 text-center text-white">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-100">Loading map</p>
    </div>
  ),
});

export default function MapPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero eyebrow={t("map.eyebrow")} title={t("map.title")} vietnamese={t("map.subtitle")}>
        <p>{t("map.body")}</p>
      </PageHero>
      <Section>
        <ResourceMap />
      </Section>
    </>
  );
}
