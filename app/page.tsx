"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  HandHeart,
  HeartHandshake,
  HomeIcon,
  Languages,
  LockKeyhole,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { HomeShowcase } from "@/components/HomeShowcase";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";
import { BrainBloom } from "@/components/Botanical";
import { BrainLeafIllustration, CompassLeafIllustration, DataGlowAccent } from "@/components/VisualStorytelling";

const pathIcons = [Brain, Users, HomeIcon];
const featureIcons = [HeartHandshake, MessageCircleHeart, BookOpen, Sparkles, HandHeart];
const aboutIcons = [Languages, HeartHandshake, ShieldCheck];

export default function Home() {
  const { t, tv } = useLanguage();
  const pathways = tv<[string, string][]>("home.pathways", []);
  const features = tv<[string, string][]>("home.features", []);
  const ca45Cards = tv<[string, string][]>("home.ca45Cards", []);
  const aboutCards = tv<[string, string][]>("pages.about.cards", []);

  return (
    <>
      <PageHero eyebrow={t("home.eyebrow")} title={t("home.title")} vietnamese={t("home.subtitle")} reflection={t("reflections.home")}>
        <p>{t("home.intro")}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/resources"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#2E5A3E] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#244832]"
          >
            {t("home.primary")}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link
            href="/conversation"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#2E5A3E] px-4 text-sm font-semibold text-[#2E5A3E] transition hover:bg-[#EAF7EF]"
          >
            {t("home.secondary")}
          </Link>
        </div>
      </PageHero>

      <Section title={t("pages.about.eyebrow")} intro={t("pages.about.body")} tone="mist">
        <div id="about-cau-noi" className="scroll-mt-28">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
            <article className="relative overflow-hidden rounded-lg border border-[#A7C6A0]/35 bg-[#FFFDF7] shadow-sm">
              <div className="relative min-h-72">
                <Image
                  src="/visuals/about-hero.png"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,253,247,0.08),rgba(255,253,247,0.86)),linear-gradient(90deg,rgba(255,253,247,0.78),transparent_70%)]" />
              </div>
              <div className="relative -mt-28 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2E5A3E]">{t("pages.about.subtitle")}</p>
                <h2 className="mt-4 text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl">{t("pages.about.title")}</h2>
                <p className="mt-4 leading-7 text-slate-700">{t("pages.about.boundaryBody")}</p>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-3">
              {aboutCards.map(([title, body], index) => {
                const Icon = aboutIcons[index] ?? Sparkles;
                return (
                  <article key={title} className="rounded-lg border border-[#A7C6A0]/30 bg-[#FFFDF7] p-5 shadow-sm">
                    <Icon size={22} className="text-[#2E5A3E]" aria-hidden="true" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      <Section title={t("home.pathTitle")} intro={t("home.pathIntro")}>
        <div className="grid gap-5 lg:grid-cols-[0.32fr_0.68fr] lg:items-stretch">
          <div className="relative hidden overflow-hidden rounded-lg border border-[#A7C6A0]/25 bg-[#F5EDE1]/80 p-5 shadow-sm lg:block">
            <CompassLeafIllustration className="h-full min-h-64 w-full" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {pathways.map(([title, body], index) => {
              const Icon = pathIcons[index];
              return (
                <article key={title} className="rounded-lg border border-[#A7C6A0]/30 bg-[#FFFDF7] p-5 shadow-sm">
                  <Icon size={24} className="text-[#2E5A3E]" aria-hidden="true" />
                  <h2 className="mt-4 text-xl font-semibold text-slate-950">{title}</h2>
                  <p className="mt-3 leading-7 text-slate-600">{body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </Section>

      <Section title={t("pages.dashboard.indicatorsTitle")} intro={t("pages.dashboard.indicatorsIntro")} tone="mist">
        <HomeShowcase />
      </Section>

      <Section title={t("home.trustTitle")} tone="mist">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map(([title, body], index) => {
            const Icon = featureIcons[index];
            return (
              <article key={title} className="rounded-lg border border-[#A7C6A0]/30 bg-[#FFFDF7] p-5 shadow-sm">
                <Icon size={22} className="text-[#2E5A3E]" aria-hidden="true" />
                <h2 className="mt-4 font-semibold text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-lg bg-[#2E5A3E] p-5 text-white">
          <LockKeyhole className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
          <p className="text-sm leading-6 text-[#FFFDF7]">{t("home.privacy")}</p>
        </div>
      </Section>

      <Section title={t("home.bilingualTitle")}>
        <p className="max-w-4xl rounded-lg border border-[#A7C6A0]/30 bg-[#FFFDF7] p-5 leading-7 text-slate-700 shadow-sm">
          {t("home.bilingualBody")}
        </p>
      </Section>

      <Section title={t("home.ca45Title")} intro={t("home.ca45Intro")} tone="mist">
        <div className="grid gap-4 md:grid-cols-2">
          {ca45Cards.map(([title, body]) => (
            <article key={title} className="rounded-lg border border-[#A7C6A0]/30 bg-[#FFFDF7] p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="relative">
          <DataGlowAccent className="opacity-70" />
          <ImpactMetrics />
        </div>
      </Section>

      <Section title={t("home.focusTitle")}>
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-lg border border-[#A7C6A0]/35 bg-[#F5EDE1] p-8 shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,253,247,0.9),transparent_18rem),radial-gradient(circle_at_80%_80%,rgba(217,241,230,0.92),transparent_16rem)]" />
            <BrainBloom className="relative h-44 w-56 text-[#2E5A3E] drop-shadow-[0_18px_30px_rgba(46,90,62,0.18)]" />
            <div className="absolute bottom-6 left-6 rounded-lg border border-[#A7C6A0]/35 bg-[#FFFDF7]/86 px-4 py-3 shadow-sm backdrop-blur-md">
              <p className="text-3xl font-semibold text-slate-950">CA-45</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2E5A3E]">{t("home.focusLabel")}</p>
            </div>
          </div>
          <div className="grid gap-4">
            <p className="leading-7 text-slate-700">{t("home.focusBody")}</p>
            <BrainLeafIllustration className="min-h-48 p-6" />
          </div>
        </div>
      </Section>
    </>
  );
}
