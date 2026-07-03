"use client";

import { Quote, Sparkles, TrendingUp } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  en: {
    statsTitle: "Built to feel useful from the first click",
    stats: [
      ["6", "navigation pages"],
      ["8", "anonymous quiz prompts"],
      ["2", "languages throughout"],
      ["24/7", "crisis access through 988"],
    ],
    testimonialsTitle: "Anonymous community feedback",
    testimonials: [
      "I would use this before talking to my parents because it gives me words that still sound respectful.",
      "The bilingual parts make it easier to explain mental health without making it feel like blame.",
      "Seeing resources and conversation practice in one place makes asking for help feel less overwhelming.",
    ],
  },
  vi: {
    statsTitle: "Hữu ích ngay từ lần bấm đầu tiên",
    stats: [
      ["6", "trang điều hướng"],
      ["8", "câu khảo sát ẩn danh"],
      ["2", "ngôn ngữ xuyên suốt"],
      ["24/7", "hỗ trợ khủng hoảng qua 988"],
    ],
    testimonialsTitle: "Phản hồi cộng đồng ẩn danh",
    testimonials: [
      "Em sẽ dùng trang này trước khi nói với ba mẹ vì nó cho em những câu nghe vẫn tôn trọng.",
      "Phần song ngữ giúp giải thích sức khỏe tinh thần dễ hơn mà không giống như đang trách ai.",
      "Có nguồn hỗ trợ và phần tập trò chuyện cùng một nơi làm việc xin giúp đỡ bớt quá sức.",
    ],
  },
} as const;

export function HomeShowcase() {
  const { language } = useLanguage();
  const text = copy[language as keyof typeof copy] ?? copy.en;

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <TrendingUp size={22} className="text-teal-700" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-950">{text.statsTitle}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {text.stats.map(([value, label], index) => (
            <article key={label} className="rounded-lg border border-slate-200 bg-[#f6faf7] p-5">
              <p className="animate-rise-in text-4xl font-semibold text-teal-800" style={{ animationDelay: `${index * 70}ms` }}>
                {value}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-600">{label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Sparkles size={22} className="text-teal-700" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-950">{text.testimonialsTitle}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {text.testimonials.map((testimonial) => (
            <article key={testimonial} className="rounded-lg border border-slate-200 bg-[#f6faf7] p-5">
              <Quote size={20} className="text-teal-700" aria-hidden="true" />
              <p className="mt-3 leading-7 text-slate-700">{testimonial}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
