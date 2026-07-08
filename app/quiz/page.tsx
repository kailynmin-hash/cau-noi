"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CrisisBanner } from "@/components/SiteFooter";
import { PageHero, Section } from "@/components/PageShell";
import { StigmaQuiz } from "@/components/StigmaQuiz";
import { BrainLeafIllustration } from "@/components/VisualStorytelling";

export default function StigmaQuizPage() {
  const { t } = useLanguage();

  return (
    <>
      <CrisisBanner compact />
      <PageHero eyebrow={t("pages.quiz.eyebrow")} title={t("pages.quiz.title")} vietnamese={t("pages.quiz.subtitle")}>
        <p>{t("pages.quiz.body")}</p>
      </PageHero>
      <Section>
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <BrainLeafIllustration className="hidden min-h-72 items-center justify-center p-8 lg:flex" />
          <StigmaQuiz />
        </div>
      </Section>
    </>
  );
}
