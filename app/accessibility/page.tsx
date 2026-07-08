"use client";

import { Check, Eye, Keyboard, RotateCcw, ScanText, Type, Volume2, ZapOff } from "lucide-react";
import type { ReactNode } from "react";
import { useAccessibility, type TextSize } from "@/components/AccessibilityProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";
import { BrainLeafIllustration, DataGlowAccent } from "@/components/VisualStorytelling";

const textSizes: TextSize[] = ["small", "default", "large", "extra-large"];

export default function AccessibilityPage() {
  const { t } = useLanguage();
  const { settings, setTextSize, toggleDyslexiaFont, toggleHighContrast, toggleReduceMotion, resetSettings } = useAccessibility();

  return (
    <>
      <PageHero eyebrow={t("accessibility.eyebrow")} title={t("accessibility.title")} vietnamese={t("accessibility.subtitle")}>
        <p>{t("accessibility.body")}</p>
      </PageHero>

      <Section title={t("accessibility.settingsTitle")} intro={t("accessibility.settingsIntro")} tone="mist">
        <div className="relative grid gap-5 xl:grid-cols-[0.36fr_0.64fr]">
          <DataGlowAccent className="opacity-55" />
          <BrainLeafIllustration className="hidden min-h-80 items-center justify-center p-8 xl:flex" />
          <div className="grid gap-4 lg:grid-cols-2">
            <SettingCard
              icon={<ScanText size={22} aria-hidden="true" />}
              title={t("accessibility.dyslexiaTitle")}
              body={t("accessibility.dyslexiaBody")}
              control={
                <SwitchButton
                  pressed={settings.dyslexiaFont}
                  onClick={toggleDyslexiaFont}
                  label={t("accessibility.dyslexiaLabel")}
                  onText={t("accessibility.on")}
                  offText={t("accessibility.off")}
                />
              }
            />
            <SettingCard
              icon={<Eye size={22} aria-hidden="true" />}
              title={t("accessibility.contrastTitle")}
              body={t("accessibility.contrastBody")}
              control={
                <SwitchButton
                  pressed={settings.highContrast}
                  onClick={toggleHighContrast}
                  label={t("accessibility.contrastLabel")}
                  onText={t("accessibility.on")}
                  offText={t("accessibility.off")}
                />
              }
            />
            <SettingCard
              icon={<Type size={22} aria-hidden="true" />}
              title={t("accessibility.textSizeTitle")}
              body={t("accessibility.textSizeBody")}
              control={
                <fieldset className="min-w-0">
                  <legend className="sr-only">{t("accessibility.textSizeLabel")}</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {textSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setTextSize(size)}
                        aria-pressed={settings.textSize === size}
                        className={`min-h-11 rounded-md border px-3 text-sm font-semibold transition ${
                          settings.textSize === size
                            ? "border-teal-800 bg-teal-800 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50"
                        }`}
                      >
                        {t(`accessibility.textSize.${size}`)}
                      </button>
                    ))}
                  </div>
                </fieldset>
              }
            />
            <SettingCard
              icon={<ZapOff size={22} aria-hidden="true" />}
              title={t("accessibility.motionTitle")}
              body={t("accessibility.motionBody")}
              control={
                <SwitchButton
                  pressed={settings.reduceMotion}
                  onClick={toggleReduceMotion}
                  label={t("accessibility.motionLabel")}
                  onText={t("accessibility.on")}
                  offText={t("accessibility.off")}
                />
              }
            />
          </div>
        </div>
      </Section>

      <Section title={t("accessibility.supportTitle")} intro={t("accessibility.supportIntro")}>
        <div className="grid gap-4 lg:grid-cols-3">
          <InfoCard icon={<Volume2 size={21} aria-hidden="true" />} title={t("accessibility.screenReaderTitle")} body={t("accessibility.screenReaderBody")} />
          <InfoCard icon={<Keyboard size={21} aria-hidden="true" />} title={t("accessibility.keyboardTitle")} body={t("accessibility.keyboardBody")} />
          <InfoCard icon={<Check size={21} aria-hidden="true" />} title={t("accessibility.altTextTitle")} body={t("accessibility.altTextBody")} />
        </div>
      </Section>

      <Section title={t("accessibility.previewTitle")} intro={t("accessibility.previewIntro")} tone="mist">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.45fr]">
          <article className="rounded-lg border border-teal-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">{t("accessibility.previewLabel")}</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">{t("accessibility.previewHeading")}</h2>
            <p className="mt-4 leading-8 text-slate-700">{t("accessibility.previewBody")}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="/resources" className="inline-flex min-h-11 items-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800">
                {t("accessibility.previewPrimary")}
              </a>
              <a href="/conversation" className="inline-flex min-h-11 items-center rounded-md border border-teal-200 bg-white px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50">
                {t("accessibility.previewSecondary")}
              </a>
            </div>
          </article>

          <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" aria-label={t("accessibility.currentSettings")}>
            <h2 className="text-lg font-semibold text-slate-950">{t("accessibility.currentSettings")}</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <SettingStatus label={t("accessibility.dyslexiaLabel")} value={settings.dyslexiaFont ? t("accessibility.on") : t("accessibility.off")} />
              <SettingStatus label={t("accessibility.contrastLabel")} value={settings.highContrast ? t("accessibility.on") : t("accessibility.off")} />
              <SettingStatus label={t("accessibility.textSizeLabel")} value={t(`accessibility.textSize.${settings.textSize}`)} />
              <SettingStatus label={t("accessibility.motionLabel")} value={settings.reduceMotion ? t("accessibility.on") : t("accessibility.off")} />
            </dl>
            <button
              type="button"
              onClick={resetSettings}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-800"
            >
              <RotateCcw size={17} aria-hidden="true" />
              {t("accessibility.reset")}
            </button>
          </aside>
        </div>
      </Section>
    </>
  );
}

function SettingCard({ icon, title, body, control }: { icon: ReactNode; title: string; body: string; control: ReactNode }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700">{icon}</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-2 leading-7 text-slate-600">{body}</p>
          <div className="mt-4">{control}</div>
        </div>
      </div>
    </article>
  );
}

function InfoCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <span className="grid size-10 place-items-center rounded-lg bg-teal-50 text-teal-700">{icon}</span>
      <h2 className="mt-4 text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 leading-7 text-slate-600">{body}</p>
    </article>
  );
}

function SwitchButton({ pressed, onClick, label, onText, offText }: { pressed: boolean; onClick: () => void; label: string; onText: string; offText: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={pressed}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-3 rounded-full border px-2 py-1 pr-4 text-sm font-semibold transition ${
        pressed ? "border-teal-800 bg-teal-800 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-teal-300"
      }`}
    >
      <span className={`grid size-8 place-items-center rounded-full transition ${pressed ? "bg-white text-teal-800" : "bg-slate-100 text-slate-500"}`}>
        <Check size={16} aria-hidden="true" />
      </span>
      {pressed ? onText : offText}
    </button>
  );
}

function SettingStatus({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <dt className="font-semibold text-slate-700">{label}</dt>
      <dd className="mt-1 text-slate-600">{value}</dd>
    </div>
  );
}
