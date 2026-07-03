"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";

const copy = {
  en: {
    eyebrow: "About",
    title: "A bridge between youth, families, schools, and care.",
    subtitle: "Designed for CA-45 and Orange County communities.",
    body:
      "Cầu Nối is designed for the Congressional App Challenge as a practical, bilingual navigator for California District 45. It is not a diagnosis tool or a replacement for professional care.",
    why: "Why it matters",
    cards: [
      [
        "Language access",
        "Youth and caregivers may need different words to describe stress, anxiety, depression, or crisis. Bilingual prompts lower the first barrier.",
      ],
      [
        "Stigma reduction",
        "The quiz and scripts reframe help-seeking as strength, preparation, and care for family wellbeing.",
      ],
      [
        "Privacy by design",
        "The app avoids identity fields entirely. It gives guidance without asking users to disclose who they are.",
      ],
    ],
    boundaries: "Data boundaries",
    boundaryBody:
      "Cầu Nối should not store names, emails, phone numbers, exact locations, school IDs, immigration status, or free-text disclosures that could identify a person. Future versions should keep analytics aggregate, opt-in, and privacy reviewed.",
  },
  vi: {
    eyebrow: "Giới thiệu",
    title: "Nhịp nối giữa thanh thiếu niên, gia đình, nhà trường, và sự chăm sóc.",
    subtitle: "Được thiết kế cho cộng đồng CA-45 và Orange County.",
    body:
      "Cầu Nối được thiết kế cho Congressional App Challenge như một công cụ điều hướng song ngữ, thực tế cho California District 45. Đây không phải công cụ chẩn đoán và không thay thế chăm sóc chuyên môn.",
    why: "Vì sao điều này quan trọng",
    cards: [
      [
        "Tiếp cận ngôn ngữ",
        "Thanh thiếu niên và người chăm sóc có thể cần những từ khác nhau để diễn tả căng thẳng, lo âu, trầm buồn, hoặc khủng hoảng. Gợi ý song ngữ giúp giảm rào cản đầu tiên.",
      ],
      [
        "Giảm định kiến",
        "Khảo sát và câu gợi ý giúp nhìn việc tìm hỗ trợ như một sự mạnh mẽ, chuẩn bị, và chăm sóc cho sức khỏe gia đình.",
      ],
      [
        "Riêng tư từ thiết kế",
        "Ứng dụng tránh hoàn toàn các trường định danh. Cầu Nối đưa ra hướng dẫn mà không yêu cầu người dùng tiết lộ họ là ai.",
      ],
    ],
    boundaries: "Ranh giới dữ liệu",
    boundaryBody:
      "Cầu Nối không nên lưu tên, email, số điện thoại, vị trí chính xác, mã số học sinh, tình trạng di trú, hoặc câu trả lời tự do có thể định danh một người. Các phiên bản sau nên giữ phân tích ở dạng tổng hợp, có sự đồng ý, và được xem xét về quyền riêng tư.",
  },
} as const;

export default function AboutPage() {
  const { language } = useLanguage();
  const text = copy[language as keyof typeof copy] ?? copy.en;

  return (
    <>
      <PageHero eyebrow={text.eyebrow} title={text.title} vietnamese={text.subtitle}>
        <p>{text.body}</p>
      </PageHero>
      <Section title={text.why}>
        <div className="grid gap-6 lg:grid-cols-3">
          {text.cards.map(([title, body]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{body}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section title={text.boundaries} tone="mist">
        <div className="max-w-3xl rounded-lg border border-slate-200 bg-white p-5 leading-7 text-slate-700 shadow-sm">
          <p>{text.boundaryBody}</p>
        </div>
      </Section>
    </>
  );
}
