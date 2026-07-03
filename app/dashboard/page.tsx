"use client";

import { Languages, ShieldCheck, Users } from "lucide-react";
import { DashboardView } from "@/components/DashboardView";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";

const copy = {
  en: {
    eyebrow: "Community Dashboard",
    title: "A non-identifying view of youth support needs.",
    subtitle: "Aggregate signals for community learning.",
    body:
      "This dashboard reads anonymous survey responses from Supabase and shows aggregate trends for community planning without collecting personal profiles.",
    indicatorsTitle: "Privacy-safe indicators",
    indicatorsIntro:
      "Only anonymous, aggregate survey fields are displayed. No names, emails, phone numbers, school names, or IP addresses appear here.",
    impactTitle: "Why This Matters in CA-45",
    impactIntro:
      "Mental-health access is shaped by language, trust, cost, family expectations, and knowing where to begin. Cầu Nối presents these issues in an educational, community-focused, nonpartisan way.",
    cards: [
      [
        "Mental-health access barriers",
        "Immigrant families may face stigma, cost concerns, transportation limits, unfamiliar health systems, uncertainty about confidentiality, and pressure to keep struggles private at home.",
      ],
      [
        "Language and stigma challenges",
        "Bilingual resources help youth explain emotions more clearly and help caregivers understand support options without relying on a child to translate sensitive health information.",
      ],
      [
        "Culturally responsive care and anonymous data",
        "Care works better when it respects language, family roles, privacy, and lived experience. Anonymous survey responses help identify access gaps while avoiding identifying information.",
      ],
    ],
  },
  vi: {
    eyebrow: "Bảng thông tin cộng đồng",
    title: "Góc nhìn không định danh về nhu cầu hỗ trợ của thanh thiếu niên.",
    subtitle: "Dữ liệu tổng hợp để cộng đồng học hỏi.",
    body:
      "Bảng này đọc các phản hồi khảo sát ẩn danh từ Supabase và hiển thị xu hướng tổng hợp để hỗ trợ cộng đồng mà không thu hồ sơ cá nhân.",
    indicatorsTitle: "Chỉ số bảo vệ riêng tư",
    indicatorsIntro:
      "Chỉ hiển thị các trường khảo sát ẩn danh và tổng hợp. Không có tên, email, số điện thoại, tên trường, hoặc địa chỉ IP trên trang này.",
    impactTitle: "Vì sao điều này quan trọng ở CA-45",
    impactIntro:
      "Việc tiếp cận chăm sóc sức khỏe tinh thần chịu ảnh hưởng bởi ngôn ngữ, niềm tin, chi phí, kỳ vọng gia đình, và việc biết bắt đầu từ đâu. Cầu Nối trình bày các vấn đề này theo cách giáo dục, hướng về cộng đồng, và phi đảng phái.",
    cards: [
      [
        "Rào cản tiếp cận chăm sóc",
        "Gia đình di dân có thể gặp định kiến, lo về chi phí, khó đi lại, chưa quen hệ thống chăm sóc, không chắc về bảo mật, và áp lực giữ kín khó khăn trong gia đình.",
      ],
      [
        "Thách thức ngôn ngữ và định kiến",
        "Tài nguyên song ngữ giúp các em diễn tả cảm xúc rõ hơn và giúp phụ huynh hiểu lựa chọn hỗ trợ mà không phải nhờ con dịch những thông tin sức khỏe nhạy cảm.",
      ],
      [
        "Chăm sóc phù hợp văn hóa và dữ liệu ẩn danh",
        "Chăm sóc hiệu quả tôn trọng ngôn ngữ, vai trò gia đình, riêng tư, và trải nghiệm sống. Phản hồi khảo sát ẩn danh giúp nhận ra khoảng trống tiếp cận mà không thu thông tin định danh.",
      ],
    ],
  },
} as const;

const icons = [Users, Languages, ShieldCheck];

export default function DashboardPage() {
  const { language } = useLanguage();
  const text = copy[language as keyof typeof copy] ?? copy.en;

  return (
    <>
      <PageHero eyebrow={text.eyebrow} title={text.title} vietnamese={text.subtitle}>
        <p>{text.body}</p>
      </PageHero>
      <Section title={text.indicatorsTitle} intro={text.indicatorsIntro}>
        <DashboardView />
      </Section>
      <Section title={text.impactTitle} intro={text.impactIntro} tone="mist">
        <div className="grid gap-4 lg:grid-cols-3">
          {text.cards.map(([title, body], index) => {
            const Icon = icons[index];
            return (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon size={22} className="text-teal-700" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-semibold text-slate-950">{title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{body}</p>
              </article>
            );
          })}
        </div>
      </Section>
    </>
  );
}
