"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CrisisBanner } from "@/components/SiteFooter";
import { PageHero, Section } from "@/components/PageShell";
import { StigmaQuiz } from "@/components/StigmaQuiz";

const copy = {
  en: {
    eyebrow: "Anonymous Stigma Quiz",
    title: "Test mental-health myths privately.",
    subtitle: "A bilingual, anonymous survey for learning and reflection.",
    body:
      "Answer eight Likert-scale prompts in English or Vietnamese. The app does not collect names, emails, school names, or IP addresses; anonymous survey fields are submitted to Supabase.",
  },
  vi: {
    eyebrow: "Khảo sát định kiến ẩn danh",
    title: "Tự tìm hiểu các hiểu lầm về sức khỏe tinh thần.",
    subtitle: "Khảo sát song ngữ, ẩn danh để học hỏi và suy ngẫm.",
    body:
      "Trả lời tám câu hỏi Likert bằng tiếng Anh hoặc tiếng Việt. Ứng dụng không thu tên, email, tên trường, hoặc địa chỉ IP; chỉ các trường khảo sát ẩn danh được gửi đến Supabase.",
  },
} as const;

export default function StigmaQuizPage() {
  const { language } = useLanguage();
  const text = copy[language];

  return (
    <>
      <CrisisBanner compact />
      <PageHero eyebrow={text.eyebrow} title={text.title} vietnamese={text.subtitle}>
        <p>{text.body}</p>
      </PageHero>
      <Section>
        <StigmaQuiz />
      </Section>
    </>
  );
}
