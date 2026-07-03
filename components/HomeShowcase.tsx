"use client";

import { Quote, Sparkles, TrendingUp } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export function HomeShowcase() {
  const { t, tv } = useLanguage();
  const stats = tv<[string, string][]>("homeShowcase.stats", []);
  const testimonials = tv<string[]>("homeShowcase.testimonials", []);

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <TrendingUp size={22} className="text-teal-700" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-950">{t("homeShowcase.statsTitle")}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([value, label], index) => (
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
          <h2 className="text-2xl font-semibold text-slate-950">{t("homeShowcase.testimonialsTitle")}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
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
