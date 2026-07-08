import type { ReactNode } from "react";
import { BotanicalSprig } from "@/components/Botanical";
import { BotanicalCorner, SectionTextureBackground, YouthHeroGraphic } from "@/components/VisualStorytelling";

export function PageHero({
  eyebrow,
  title,
  vietnamese,
  children,
}: {
  eyebrow: string;
  title: string;
  vietnamese: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-teal-950/10 bg-[#eef7f1] shadow-[inset_0_-1px_0_rgba(46,90,62,0.08)]">
      <YouthHeroGraphic className="hidden w-[68rem] max-w-[72vw] lg:block" />
      <BotanicalSprig className="pointer-events-none absolute -right-10 top-8 hidden h-72 w-56 text-[#2E5A3E]/45 sm:block" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,253,247,0.94),transparent_28rem),linear-gradient(90deg,rgba(255,253,247,0.97),rgba(255,253,247,0.82)_44%,rgba(255,253,247,0.34)_76%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FFFDF7]/90 to-transparent" />
      <div className="animate-rise-in relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-teal-800">{eyebrow}</p>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-slate-950 drop-shadow-[0_1px_0_rgba(255,253,247,0.72)] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-lg font-medium text-teal-800">{vietnamese}</p>
          </div>
          <div className="max-w-2xl rounded-lg border border-[#A7C6A0]/25 bg-[#FFFDF7]/82 p-5 text-base leading-8 text-slate-700 shadow-sm backdrop-blur-md lg:justify-self-end">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Section({
  title,
  intro,
  children,
  tone = "white",
}: {
  title?: string;
  intro?: string;
  children: ReactNode;
  tone?: "white" | "mist";
}) {
  return (
    <section className={`relative overflow-hidden ${tone === "mist" ? "bg-[#f3f8f5]" : "bg-white"}`}>
      <SectionTextureBackground className="opacity-60" />
      <BotanicalSprig className="pointer-events-none absolute -right-16 top-10 h-64 w-48 text-[#2E5A3E]/[0.07]" />
      <BotanicalCorner side="left" className="hidden opacity-50 lg:block" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {(title || intro) && (
          <div className="mb-8 max-w-3xl">
            {title && <h2 className="text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl">{title}</h2>}
            {intro && <p className="mt-3 leading-8 text-slate-600">{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
