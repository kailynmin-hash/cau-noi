"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";
import { ResourceMap } from "@/components/ResourceMap";

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
