"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Brain, HandHeart, HeartHandshake, HomeIcon, LockKeyhole, MessageCircleHeart, Sparkles, Users } from "lucide-react";
import { HomeShowcase } from "@/components/HomeShowcase";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";

const pathIcons = [Brain, Users, HomeIcon];
const featureIcons = [HeartHandshake, MessageCircleHeart, BookOpen, Sparkles, HandHeart];

export default function Home() {
  const { t, tv } = useLanguage();
  const pathways = tv<[string, string][]>("home.pathways", []);
  const features = tv<[string, string][]>("home.features", []);
  const ca45Cards = tv<[string, string][]>("home.ca45Cards", []);

  return (
    <>
      <PageHero eyebrow={t("home.eyebrow")} title={t("home.title")} vietnamese={t("home.subtitle")}>
        <p>{t("home.intro")}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/resources"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
          >
            {t("home.primary")}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link
            href="/conversation"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-teal-700 px-4 text-sm font-semibold text-teal-800 transition hover:bg-teal-50"
          >
            {t("home.secondary")}
          </Link>
        </div>
      </PageHero>

      <Section title={t("home.pathTitle")} intro={t("home.pathIntro")}>
        <div className="grid gap-4 md:grid-cols-3">
          {pathways.map(([title, body], index) => {
            const Icon = pathIcons[index];
            return (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon size={24} className="text-teal-700" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-semibold text-slate-950">{title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{body}</p>
              </article>
            );
          })}
        </div>
      </Section>

      <Section tone="mist">
        <HomeShowcase />
      </Section>

      <Section title={t("home.trustTitle")} tone="mist">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map(([title, body], index) => {
            const Icon = featureIcons[index];
            return (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon size={22} className="text-teal-700" aria-hidden="true" />
                <h2 className="mt-4 font-semibold text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-lg bg-teal-800 p-5 text-white">
          <LockKeyhole className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
          <p className="text-sm leading-6 text-teal-50">{t("home.privacy")}</p>
        </div>
      </Section>

      <Section title={t("home.bilingualTitle")}>
        <p className="max-w-4xl rounded-lg border border-slate-200 bg-white p-5 leading-7 text-slate-700 shadow-sm">
          {t("home.bilingualBody")}
        </p>
      </Section>

      <Section title={t("home.ca45Title")} intro={t("home.ca45Intro")} tone="mist">
        <div className="grid gap-4 md:grid-cols-2">
          {ca45Cards.map(([title, body]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <ImpactMetrics />
      </Section>

      <Section title={t("home.focusTitle")}>
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="flex min-h-64 items-center justify-center rounded-lg bg-[#dcefe6] p-8">
            <div className="text-center">
              <Sparkles size={42} className="mx-auto text-teal-800" aria-hidden="true" />
              <p className="mt-4 text-3xl font-semibold text-slate-950">CA-45</p>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-teal-800">{t("home.focusLabel")}</p>
            </div>
          </div>
          <p className="leading-7 text-slate-700">{t("home.focusBody")}</p>
        </div>
      </Section>
    </>
  );
}
