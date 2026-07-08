"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";
import { ResourceMap } from "@/components/ResourceMap";
import { DataGlowAccent } from "@/components/VisualStorytelling";

export default function MapPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero eyebrow={t("map.eyebrow")} title={t("map.title")} vietnamese={t("map.subtitle")} reflection={t("reflections.map")}>
        <p>{t("map.body")}</p>
      </PageHero>
      <Section>
        <div className="relative">
          <DataGlowAccent className="opacity-85" />
          <ResourceMap />
        </div>
      </Section>
    </>
  );
}
