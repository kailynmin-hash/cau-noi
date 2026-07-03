"use client";

import { ConversationHelper } from "@/components/ConversationHelper";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";

const copy = {
  en: {
    eyebrow: "Family Conversation Helper",
    title: "Practice hard conversations before they happen.",
    subtitle: "Respectful scripts for teens and parents.",
    body:
      "Browse common scenarios and adapt the English and Vietnamese prompts. Nothing you copy or practice is stored.",
  },
  vi: {
    eyebrow: "Hỗ trợ trò chuyện gia đình",
    title: "Tập những cuộc trò chuyện khó trước khi bắt đầu.",
    subtitle: "Câu gợi ý tôn trọng cho teen và cha mẹ.",
    body:
      "Xem các tình huống thường gặp và điều chỉnh lời gợi ý bằng tiếng Anh và tiếng Việt. Nội dung bạn sao chép hoặc tập nói không được lưu lại.",
  },
} as const;

export default function FamilyHelperPage() {
  const { language } = useLanguage();
  const text = copy[language as keyof typeof copy] ?? copy.en;

  return (
    <>
      <PageHero eyebrow={text.eyebrow} title={text.title} vietnamese={text.subtitle}>
        <p>{text.body}</p>
      </PageHero>
      <Section>
        <ConversationHelper />
      </Section>
    </>
  );
}
