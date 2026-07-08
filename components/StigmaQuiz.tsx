"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, BookOpen, CheckCircle2, HelpCircle, Languages, LockKeyhole, MessageCircleHeart, RotateCcw, Save } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { LoadingSpinner } from "@/components/LoadingStates";
import { incrementImpact } from "@/lib/impact";
import { quizPreferredLanguageOptions } from "@/lib/languages";
import { type SurveyResponse } from "@/lib/supabase";

const directQuestions = [
  {
    key: "comfort_talking_home",
  },
  {
    key: "knows_where_to_get_help",
  },
  {
    key: "language_barrier",
  },
  {
    key: "would_use_bilingual_tool",
  },
] as const;

const stigmaQuestions = [
  "counselingWeak",
  "familyShame",
  "suicideDirect",
  "therapySevere",
] as const;

type DirectQuestionKey = (typeof directQuestions)[number]["key"];
type DirectAnswers = Partial<Record<DirectQuestionKey, number>>;

export function StigmaQuiz() {
  const { t, tv } = useLanguage();
  const copy = {
    anonymousTitle: t("quiz.anonymousTitle"),
    anonymousBody: t("quiz.anonymousBody"),
    ageGroup: t("quiz.ageGroup"),
    selectAge: t("quiz.selectAge"),
    preferredLanguage: t("quiz.preferredLanguage"),
    selectLanguage: t("quiz.selectLanguage"),
    question: t("quiz.question"),
    answered: t("quiz.answered"),
    stigmaScore: t("quiz.stigmaScore"),
    reset: t("quiz.reset"),
    submit: t("quiz.submit"),
    submitting: t("quiz.submitting"),
    thankYou: t("quiz.thankYou"),
    thankYouBody: t("quiz.thankYouBody"),
    errorTitle: t("quiz.errorTitle"),
    errorBody: t("quiz.errorBody"),
    submitFailed: t("quiz.submitFailed"),
    mythFact: t("quiz.mythFact"),
    mythFactIntro: t("quiz.mythFactIntro"),
    myth: t("quiz.myth"),
    fact: t("quiz.fact"),
    recTitle: t("quiz.recTitle"),
    recIntro: t("quiz.recIntro"),
    recEducation: tv("quiz.recommendations.education", [] as string[]),
    recLanguage: tv("quiz.recommendations.language", [] as string[]),
    recFamily: tv("quiz.recommendations.family", [] as string[]),
    recGeneral: tv("quiz.recommendations.general", [] as string[]),
    likert: tv("quiz.likert", [] as string[]),
    ages: tv("quiz.ages", [] as string[]),
  };
  const [ageGroup, setAgeGroup] = useState("");
  const [surveyLanguage, setSurveyLanguage] = useState("");
  const [directAnswers, setDirectAnswers] = useState<DirectAnswers>({});
  const [stigmaAnswers, setStigmaAnswers] = useState<Record<number, number>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [debugOutput, setDebugOutput] = useState<unknown>(null);

  const answeredCount = Object.keys(directAnswers).length + Object.keys(stigmaAnswers).length;
  const totalQuestions = directQuestions.length + stigmaQuestions.length;
  const complete = Boolean(ageGroup && surveyLanguage && answeredCount === totalQuestions);

  const stigmaScore = useMemo(() => {
    if (Object.keys(stigmaAnswers).length !== stigmaQuestions.length) return null;
    const total = Object.values(stigmaAnswers).reduce((sum, value) => sum + value, 0);
    return Number((total / stigmaQuestions.length).toFixed(2));
  }, [stigmaAnswers]);

  const submitQuiz = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!complete || stigmaScore === null) return;

    const payload: SurveyResponse = {
      age_group: ageGroup,
      language: surveyLanguage,
      comfort_talking_home: directAnswers.comfort_talking_home ?? 0,
      knows_where_to_get_help: directAnswers.knows_where_to_get_help ?? 0,
      language_barrier: directAnswers.language_barrier ?? 0,
      stigma_score: stigmaScore,
      would_use_bilingual_tool: directAnswers.would_use_bilingual_tool ?? 0,
    };

    setStatus("saving");
    setError("");
    setDebugOutput(null);

    const submitUrl = "/api/quiz-submissions";
    let failedPostDebug: unknown = null;

    try {
      console.log("quiz submit payload", payload);
      console.info("[quiz] submitting anonymous response", {
        requestUrl: submitUrl,
        requestBody: payload,
      });

      const result = await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const resultPayload = (await result.json().catch(() => null)) as Record<string, unknown> | null;

      console.info("[quiz] submission response", {
        requestUrl: submitUrl,
        responseStatus: result.status,
        responseJson: resultPayload,
      });

      if (!result.ok || !resultPayload?.ok) {
        failedPostDebug = {
          responseStatus: result.status,
          responseJson: resultPayload,
          status: resultPayload?.status,
          missingFields: resultPayload?.missingFields,
          receivedBody: resultPayload?.receivedBody,
          debugError: resultPayload?.debugError,
          debugDetails: resultPayload?.debugDetails,
        };
        setDebugOutput(failedPostDebug);
        throw new Error(typeof resultPayload?.error === "string" ? resultPayload.error : copy.submitFailed);
      }
    } catch (submitError) {
      const fallbackDebug = {
        responseStatus: null,
        responseJson: null,
        missingFields: null,
        receivedBody: payload,
        debugError: submitError instanceof Error ? submitError.message : String(submitError),
        debugDetails: submitError,
      };
      console.error("[quiz] submission failed", {
        requestUrl: submitUrl,
        requestBody: payload,
        error: submitError,
      });
      setStatus("error");
      setDebugOutput(failedPostDebug ?? fallbackDebug);
      setError(submitError instanceof Error ? submitError.message : copy.errorBody);
      return;
    }

    setStatus("success");
    incrementImpact("quizzesCompleted");
  };

  const resetQuiz = () => {
    setAgeGroup("");
    setSurveyLanguage("");
    setDirectAnswers({});
    setStigmaAnswers({});
    setStatus("idle");
    setError("");
    setDebugOutput(null);
  };

  return (
    <form onSubmit={submitQuiz} className="grid gap-5" aria-busy={status === "saving"}>
      <div className="rounded-lg border border-teal-200 bg-teal-50 p-5 text-teal-950">
        <p className="flex items-center gap-2 font-semibold">
          <LockKeyhole size={18} aria-hidden="true" />
          {copy.anonymousTitle}
        </p>
        <p className="mt-2 text-sm leading-6">{copy.anonymousBody}</p>
      </div>

      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
        <SelectField label={copy.ageGroup} value={ageGroup} placeholder={copy.selectAge} options={copy.ages} onChange={setAgeGroup} />
        <SelectField
          label={copy.preferredLanguage}
          value={surveyLanguage}
          placeholder={copy.selectLanguage}
          options={quizPreferredLanguageOptions}
          onChange={setSurveyLanguage}
        />
      </section>

      {directQuestions.map((item, index) => (
        <LikertFieldset
          key={item.key}
          number={index + 1}
          questionLabel={copy.question}
          options={copy.likert}
          statement={t(`quiz.directQuestions.${item.key}`)}
          value={directAnswers[item.key]}
          onChange={(value) => setDirectAnswers((current) => ({ ...current, [item.key]: value }))}
        />
      ))}

      {stigmaQuestions.map((item, index) => (
        <LikertFieldset
          key={item}
          number={directQuestions.length + index + 1}
          questionLabel={copy.question}
          options={copy.likert}
          statement={t(`quiz.stigmaQuestions.${item}.statement`)}
          value={stigmaAnswers[index]}
          onChange={(value) => setStigmaAnswers((current) => ({ ...current, [index]: value }))}
        />
      ))}

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-700">
            {answeredCount}/{totalQuestions} {copy.answered}
            {stigmaScore !== null && ` · ${copy.stigmaScore} ${stigmaScore}/5`}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={resetQuiz}
              disabled={status === "saving"}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw size={16} aria-hidden="true" />
              {copy.reset}
            </button>
            <button
              type="submit"
              disabled={!complete || status === "saving"}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {status === "saving" ? (
                <LoadingSpinner label={copy.submitting} />
              ) : (
                <>
                  <Save size={16} aria-hidden="true" />
                  {copy.submit}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {status === "success" && (
        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
          <p className="flex items-center gap-2 font-semibold">
            <CheckCircle2 size={18} aria-hidden="true" />
            {copy.thankYou}
          </p>
          <p className="mt-2 text-sm leading-6">{copy.thankYouBody}</p>
        </section>
      )}

      {status === "success" && (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">{copy.recTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{copy.recIntro}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {getRecommendations({
              stigmaScore,
              languageBarrier: directAnswers.language_barrier ?? 0,
              comfortTalkingHome: directAnswers.comfort_talking_home ?? 0,
              copy,
            }).map((recommendation) => (
              <Link
                key={recommendation.title}
                href={recommendation.href}
                className="rounded-lg border border-slate-200 bg-[#f6faf7] p-4 transition hover:border-teal-300 hover:bg-teal-50"
              >
                <recommendation.icon size={20} className="text-teal-700" aria-hidden="true" />
                <h3 className="mt-3 font-semibold text-slate-950">{recommendation.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{recommendation.body}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {status === "error" && (
        <section className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-rose-950">
          <p className="flex items-center gap-2 font-semibold">
            <AlertCircle size={18} aria-hidden="true" />
            {copy.errorTitle}
          </p>
          <p className="mt-2 text-sm leading-6">{error || copy.errorBody}</p>
          <pre className="mt-4 max-h-80 overflow-auto rounded-md bg-white p-3 text-xs leading-5 text-slate-900">
            {JSON.stringify(debugOutput ?? { error: error || copy.errorBody }, null, 2)}
          </pre>
        </section>
      )}

      {status === "success" && (
        <section className="grid gap-4" aria-label={copy.mythFact}>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">{copy.mythFact}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{copy.mythFactIntro}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {stigmaQuestions.map((item) => (
              <article key={item} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">{copy.myth}</p>
                <h3 className="mt-2 font-semibold text-slate-950">{t(`quiz.stigmaQuestions.${item}.myth`)}</h3>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">{copy.fact}</p>
                <p className="mt-2 leading-7 text-slate-700">{t(`quiz.stigmaQuestions.${item}.fact`)}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </form>
  );
}

function getRecommendations({
  stigmaScore,
  languageBarrier,
  comfortTalkingHome,
  copy,
}: {
  stigmaScore: number | null;
  languageBarrier: number;
  comfortTalkingHome: number;
  copy: {
    recEducation: string[];
    recLanguage: string[];
    recFamily: string[];
    recGeneral: string[];
  };
}) {
  const recommendations: { title: string; body: string; href: string; icon: typeof BookOpen }[] = [];

  if ((stigmaScore ?? 0) >= 3.25) {
    recommendations.push({ title: copy.recEducation[0], body: copy.recEducation[1], href: "/quiz", icon: BookOpen });
  }
  if (languageBarrier >= 4) {
    recommendations.push({ title: copy.recLanguage[0], body: copy.recLanguage[1], href: "/resources", icon: Languages });
  }
  if (comfortTalkingHome <= 2) {
    recommendations.push({ title: copy.recFamily[0], body: copy.recFamily[1], href: "/conversation", icon: MessageCircleHeart });
  }
  if (recommendations.length === 0) {
    recommendations.push({ title: copy.recGeneral[0], body: copy.recGeneral[1], href: "/map", icon: CheckCircle2 });
  }

  return recommendations;
}

function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: readonly (string | { value: string; label: string })[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-800">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={typeof option === "string" ? option : option.value} value={typeof option === "string" ? option : option.value}>
            {typeof option === "string" ? option : option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function LikertFieldset({
  number,
  questionLabel,
  statement,
  options,
  value,
  onChange,
}: {
  number: number;
  questionLabel: string;
  statement: string;
  options: readonly string[];
  value?: number;
  onChange: (value: number) => void;
}) {
  return (
    <fieldset className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <legend className="flex gap-3">
        <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-800">
          <HelpCircle size={18} aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            {questionLabel} {number}
          </span>
          <span className="mt-1 block text-lg font-semibold text-slate-950">{statement}</span>
        </span>
      </legend>

      <div className="mt-5 grid gap-2 sm:grid-cols-5" role="radiogroup" aria-label={statement}>
        {options.map((label, index) => {
          const optionValue = index + 1;
          return (
            <label
              key={label}
              className={`flex min-h-16 cursor-pointer items-center justify-center rounded-md border px-2 py-3 text-center text-xs font-semibold transition ${
                value === optionValue
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-teal-50"
              }`}
            >
              <input
                type="radio"
                name={`question-${number}`}
                value={optionValue}
                checked={value === optionValue}
                onChange={() => onChange(optionValue)}
                className="sr-only"
                required
              />
              {label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
