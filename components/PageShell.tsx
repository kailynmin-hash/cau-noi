import type { ReactNode } from "react";
import { BotanicalSprig } from "@/components/Botanical";
import { BotanicalCorner, ReflectiveMessage, SectionTextureBackground, YouthHeroGraphic, type HeroVisual } from "@/components/VisualStorytelling";

export function PageHero({
  eyebrow,
  title,
  vietnamese,
  reflection,
  visual = "home",
  children,
}: {
  eyebrow: string;
  title: string;
  vietnamese: string;
  reflection?: string;
  visual?: HeroVisual;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[#2E5A3E]/10 bg-[#F5EDE1] shadow-[inset_0_-1px_0_rgba(46,90,62,0.08)]">
      <YouthHeroGraphic visual={visual} className="z-0 hidden w-[78rem] max-w-[78vw] lg:block" />
      <BotanicalSprig className="pointer-events-none absolute -right-10 top-8 z-10 hidden h-72 w-56 text-[#2E5A3E]/45 sm:block" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(255,253,247,0.98),transparent_28rem),linear-gradient(90deg,rgba(255,253,247,0.98)_0%,rgba(255,253,247,0.88)_40%,rgba(255,253,247,0.3)_60%,rgba(255,253,247,0.02)_84%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-[#FFFDF7]/90 to-transparent" />
      <div className="animate-rise-in relative z-20 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#2E5A3E]">{eyebrow}</p>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="rounded-lg bg-[#FFFDF7]/70 p-5 shadow-[0_18px_60px_rgba(46,90,62,0.08)] backdrop-blur-[2px]">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-slate-950 drop-shadow-[0_1px_0_rgba(255,253,247,0.72)] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-lg font-medium text-[#2E5A3E]">{vietnamese}</p>
            {reflection ? <ReflectiveMessage className="mt-6 max-w-xl text-[#2E5A3E]/90">{reflection}</ReflectiveMessage> : null}
          </div>
          <div className="max-w-2xl rounded-lg border border-[#A7C6A0]/30 bg-[#FFFDF7]/94 p-5 text-base leading-8 text-slate-700 shadow-sm backdrop-blur-md lg:justify-self-end">
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
    <section className={`relative overflow-hidden ${tone === "mist" ? "bg-[#F5EDE1]/70" : "bg-[#FFFDF7]"}`}>
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
