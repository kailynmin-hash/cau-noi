"use client";

import { ConversationHelper } from "@/components/ConversationHelper";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";

export default function FamilyHelperPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero eyebrow={t("pages.conversation.eyebrow")} title={t("pages.conversation.title")} vietnamese={t("pages.conversation.subtitle")}>
        <p>{t("pages.conversation.body")}</p>
      </PageHero>
      <Section>
        <ConversationHelper />
      </Section>
    </>
  );
}
