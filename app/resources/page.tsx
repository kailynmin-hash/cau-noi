"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { ResourceFinder } from "@/components/ResourceFinder";
import { PageHero, Section } from "@/components/PageShell";

export default function ResourceFinderPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero eyebrow={t("resourcesPage.eyebrow")} title={t("resourcesPage.title")} vietnamese={t("resourcesPage.subtitle")}>
        <p>{t("resourcesPage.body")}</p>
      </PageHero>
      <Section intro={t("resourcesPage.intro")}>
        <ResourceFinder />
      </Section>
    </>
  );
}
