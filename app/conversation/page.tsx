"use client";

import { ConversationHelper } from "@/components/ConversationHelper";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";
import { BrainLeafIllustration, QuoteMoment } from "@/components/VisualStorytelling";

export default function FamilyHelperPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero eyebrow={t("pages.conversation.eyebrow")} title={t("pages.conversation.title")} vietnamese={t("pages.conversation.subtitle")} reflection={t("reflections.conversation")} visual="conversation">
        <p>{t("pages.conversation.body")}</p>
      </PageHero>
      <Section>
        <div className="grid gap-6 xl:grid-cols-[0.28fr_0.72fr] xl:items-start">
          <div className="hidden gap-5 xl:grid">
            <BrainLeafIllustration className="min-h-72 items-center justify-center p-8 xl:flex" />
            <QuoteMoment>{t("quoteMoments.conversation")}</QuoteMoment>
          </div>
          <ConversationHelper />
        </div>
      </Section>
    </>
  );
}
