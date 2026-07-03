"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CrisisBanner } from "@/components/SiteFooter";
import { PageHero, Section } from "@/components/PageShell";
import { StigmaQuiz } from "@/components/StigmaQuiz";

export default function StigmaQuizPage() {
  const { t } = useLanguage();

  return (
    <>
      <CrisisBanner compact />
      <PageHero eyebrow={t("pages.quiz.eyebrow")} title={t("pages.quiz.title")} vietnamese={t("pages.quiz.subtitle")}>
        <p>{t("pages.quiz.body")}</p>
      </PageHero>
      <Section>
        <StigmaQuiz />
      </Section>
    </>
  );
}
