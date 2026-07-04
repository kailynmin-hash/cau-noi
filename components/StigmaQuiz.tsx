"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, BookOpen, CheckCircle2, HelpCircle, Languages, LockKeyhole, MessageCircleHeart, RotateCcw, Save } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { incrementImpact } from "@/lib/impact";
import { type SurveyResponse } from "@/lib/supabase";

const quizCopy = {
  en: {
    anonymousTitle: "Anonymous by design",
    anonymousBody:
      "This quiz does not ask for names, emails, phone numbers, school names, addresses, or other identifying details. The app inserts only anonymous survey fields into Supabase and does not store IP addresses in the survey table.",
    ageGroup: "Age group",
    selectAge: "Select an age group",
    preferredLanguage: "Preferred language",
    selectLanguage: "Select a language",
    question: "Question",
    answered: "Likert questions answered",
    stigmaScore: "stigma score",
    reset: "Reset",
    submit: "Submit anonymously",
    submitting: "Submitting...",
    thankYou: "Thank you",
    thankYouBody:
      "Thank you — your anonymous response was saved. No names, emails, phone numbers, school names, or IP addresses were stored in the survey response.",
    errorTitle: "Submission was not saved",
    errorBody: "We couldn't save your response. Please try again.",
    storageNotConfigured: "Quiz storage is not configured yet.",
    mythFact: "Myth vs. fact",
    mythFactIntro: "Use these explanations as conversation starters. They are not a diagnosis or medical advice.",
    myth: "Myth",
    fact: "Fact",
    recTitle: "Personalized next steps",
    recIntro: "Based on your anonymous answers, Cầu Nối suggests a few practical places to start.",
    recEducation: ["Learn about stigma", "Your stigma score was elevated. Start with myth-vs-fact education and stories that frame help-seeking as strength."],
    recLanguage: ["Prioritize bilingual resources", "Language barriers showed up strongly. Look for Vietnamese or interpreter-supported options first."],
    recFamily: ["Practice a family conversation", "Family communication felt difficult. Use the conversation helper to prepare a respectful first sentence."],
    recGeneral: ["Keep building your support map", "Your answers show several strengths. Save one resource and one trusted adult before stress gets bigger."],
    likert: ["Strongly disagree", "Disagree", "Not sure", "Agree", "Strongly agree"],
    ages: ["Under 13", "13-15", "16-18", "19-24", "Parent / caregiver", "Prefer not to say"],
    languages: ["English", "Vietnamese", "English and Vietnamese", "Another language", "Prefer not to say"],
  },
  vi: {
    anonymousTitle: "Thiết kế ẩn danh",
    anonymousBody:
      "Khảo sát này không hỏi tên, email, số điện thoại, tên trường, địa chỉ, hoặc thông tin định danh khác. Ứng dụng chỉ gửi các trường khảo sát ẩn danh vào Supabase và không lưu địa chỉ IP trong bảng khảo sát.",
    ageGroup: "Nhóm tuổi",
    selectAge: "Chọn nhóm tuổi",
    preferredLanguage: "Ngôn ngữ ưu tiên",
    selectLanguage: "Chọn ngôn ngữ",
    question: "Câu",
    answered: "câu Likert đã trả lời",
    stigmaScore: "điểm định kiến",
    reset: "Làm lại",
    submit: "Gửi ẩn danh",
    submitting: "Đang gửi...",
    thankYou: "Cảm ơn bạn",
    thankYouBody:
      "Cảm ơn bạn — câu trả lời ẩn danh của bạn đã được lưu. Không có tên, email, số điện thoại, tên trường, hoặc địa chỉ IP nào được lưu trong phản hồi khảo sát.",
    errorTitle: "Chưa lưu được phản hồi",
    errorBody: "Chúng tôi chưa lưu được câu trả lời của bạn. Vui lòng thử lại.",
    storageNotConfigured: "Chưa cấu hình nơi lưu câu trả lời cho quiz.",
    mythFact: "Hiểu lầm và sự thật",
    mythFactIntro: "Bạn có thể dùng phần giải thích này để bắt đầu trò chuyện. Đây không phải chẩn đoán hoặc lời khuyên y tế.",
    myth: "Hiểu lầm",
    fact: "Sự thật",
    recTitle: "Bước tiếp theo dành cho bạn",
    recIntro: "Dựa trên câu trả lời ẩn danh của bạn, Cầu Nối gợi ý một vài nơi thực tế để bắt đầu.",
    recEducation: ["Tìm hiểu về định kiến", "Điểm định kiến của bạn khá cao. Hãy bắt đầu với phần hiểu lầm và sự thật để nhìn việc tìm hỗ trợ như một sự mạnh mẽ."],
    recLanguage: ["Ưu tiên nguồn hỗ trợ song ngữ", "Rào cản ngôn ngữ xuất hiện rõ. Hãy tìm lựa chọn có tiếng Việt hoặc hỗ trợ thông dịch trước."],
    recFamily: ["Tập trò chuyện với gia đình", "Việc giao tiếp trong gia đình có vẻ khó. Hãy dùng công cụ trò chuyện để chuẩn bị một câu mở đầu tôn trọng."],
    recGeneral: ["Tiếp tục xây dựng bản đồ hỗ trợ", "Câu trả lời của bạn cho thấy nhiều điểm mạnh. Hãy lưu một nguồn hỗ trợ và một người lớn đáng tin cậy trước khi căng thẳng lớn hơn."],
    likert: ["Rất không đồng ý", "Không đồng ý", "Chưa chắc", "Đồng ý", "Rất đồng ý"],
    ages: ["Dưới 13", "13-15", "16-18", "19-24", "Cha mẹ / người chăm sóc", "Không muốn trả lời"],
    languages: ["Tiếng Anh", "Tiếng Việt", "Tiếng Anh và tiếng Việt", "Ngôn ngữ khác", "Không muốn trả lời"],
  },
} as const;

const directQuestions = [
  {
    key: "comfort_talking_home",
    statement: {
      en: "I feel comfortable talking about mental health at home.",
      vi: "Tôi cảm thấy thoải mái khi nói về sức khỏe tinh thần ở nhà.",
    },
  },
  {
    key: "knows_where_to_get_help",
    statement: {
      en: "I know where to get help if I or a friend needs mental-health support.",
      vi: "Tôi biết có thể tìm sự giúp đỡ ở đâu nếu tôi hoặc một người bạn cần hỗ trợ sức khỏe tinh thần.",
    },
  },
  {
    key: "language_barrier",
    statement: {
      en: "Language makes it harder for my family to understand or access mental-health support.",
      vi: "Rào cản ngôn ngữ khiến gia đình tôi khó hiểu hoặc khó tiếp cận hỗ trợ sức khỏe tinh thần hơn.",
    },
  },
  {
    key: "would_use_bilingual_tool",
    statement: {
      en: "I would use a bilingual tool to prepare for a mental-health conversation.",
      vi: "Tôi sẽ dùng một công cụ song ngữ để chuẩn bị cho cuộc trò chuyện về sức khỏe tinh thần.",
    },
  },
] as const;

const stigmaQuestions = [
  {
    statement: {
      en: "A student who needs counseling is probably weak.",
      vi: "Một học sinh cần tư vấn tâm lý có lẽ là yếu đuối.",
    },
    myth: { en: "Needing counseling means someone is weak.", vi: "Cần tư vấn nghĩa là yếu đuối." },
    fact: {
      en: "Counseling is a support tool, like tutoring for emotional skills. Asking early often prevents bigger crises.",
      vi: "Tư vấn là một hình thức hỗ trợ, giống như được hướng dẫn thêm về kỹ năng cảm xúc. Tìm giúp đỡ sớm thường giúp tránh khủng hoảng lớn hơn.",
    },
  },
  {
    statement: {
      en: "Talking about mental health can bring shame to a family.",
      vi: "Nói về sức khỏe tinh thần có thể làm gia đình mất mặt.",
    },
    myth: { en: "Mental-health conversations are shameful.", vi: "Nói về sức khỏe tinh thần là điều đáng xấu hổ." },
    fact: {
      en: "Private, respectful conversations can protect family wellbeing and help someone get support before problems grow.",
      vi: "Những cuộc trò chuyện riêng tư và tôn trọng có thể bảo vệ sức khỏe của gia đình và giúp một người nhận hỗ trợ trước khi vấn đề nặng hơn.",
    },
  },
  {
    statement: {
      en: "If someone mentions suicide, it is better not to ask about it directly.",
      vi: "Nếu ai đó nhắc đến tự tử, tốt hơn là không hỏi trực tiếp.",
    },
    myth: { en: "Asking about suicide makes things worse.", vi: "Hỏi về tự tử sẽ làm tình hình tệ hơn." },
    fact: {
      en: "Asking directly and connecting someone to immediate support can reduce danger. In the U.S., call or text 988.",
      vi: "Hỏi trực tiếp và kết nối người đó với hỗ trợ khẩn cấp có thể giảm nguy hiểm. Tại Hoa Kỳ, hãy gọi hoặc nhắn tin 988.",
    },
  },
  {
    statement: {
      en: "Therapy is only for people with severe mental illness.",
      vi: "Trị liệu chỉ dành cho người bị bệnh tâm thần rất nặng.",
    },
    myth: { en: "Therapy is only for extreme situations.", vi: "Trị liệu chỉ dành cho tình huống rất nghiêm trọng." },
    fact: {
      en: "Therapy can help with stress, anxiety, grief, family conflict, identity questions, sleep, and coping skills.",
      vi: "Trị liệu có thể giúp khi căng thẳng, lo âu, mất mát, mâu thuẫn gia đình, thắc mắc về bản thân, giấc ngủ, và kỹ năng đối phó.",
    },
  },
];

type DirectQuestionKey = (typeof directQuestions)[number]["key"];
type DirectAnswers = Partial<Record<DirectQuestionKey, number>>;

export function StigmaQuiz() {
  const { language: appLanguage } = useLanguage();
  const copy = quizCopy[appLanguage as keyof typeof quizCopy] ?? quizCopy.en;
  const quizLanguage = appLanguage === "vi" ? "vi" : "en";
  const [ageGroup, setAgeGroup] = useState("");
  const [surveyLanguage, setSurveyLanguage] = useState("");
  const [directAnswers, setDirectAnswers] = useState<DirectAnswers>({});
  const [stigmaAnswers, setStigmaAnswers] = useState<Record<number, number>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState("");

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

    const submitUrl = "/api/quiz-submissions";

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
      const resultPayload = (await result.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      console.info("[quiz] submission response", {
        requestUrl: submitUrl,
        responseStatus: result.status,
        responseJson: resultPayload,
      });

      if (!result.ok || !resultPayload?.ok) {
        if (result.status === 503) {
          setError(copy.storageNotConfigured);
        }
        throw new Error(resultPayload?.error ?? "Quiz submission failed.");
      }
    } catch (submitError) {
      console.error("[quiz] submission failed", {
        requestUrl: submitUrl,
        requestBody: payload,
        error: submitError,
      });
      setStatus("error");
      setError((current) => current || copy.errorBody);
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
  };

  return (
    <form onSubmit={submitQuiz} className="grid gap-5">
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
          options={copy.languages}
          onChange={setSurveyLanguage}
        />
      </section>

      {directQuestions.map((item, index) => (
        <LikertFieldset
          key={item.key}
          number={index + 1}
          questionLabel={copy.question}
          options={copy.likert}
          statement={item.statement[quizLanguage]}
          value={directAnswers[item.key]}
          onChange={(value) => setDirectAnswers((current) => ({ ...current, [item.key]: value }))}
        />
      ))}

      {stigmaQuestions.map((item, index) => (
        <LikertFieldset
          key={item.statement.en}
          number={directQuestions.length + index + 1}
          questionLabel={copy.question}
          options={copy.likert}
          statement={item.statement[quizLanguage]}
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
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw size={16} aria-hidden="true" />
              {copy.reset}
            </button>
            <button
              type="submit"
              disabled={!complete || status === "saving"}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Save size={16} aria-hidden="true" />
              {status === "saving" ? copy.submitting : copy.submit}
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
              <article key={item.myth.en} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">{copy.myth}</p>
                <h3 className="mt-2 font-semibold text-slate-950">{item.myth[quizLanguage]}</h3>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">{copy.fact}</p>
                <p className="mt-2 leading-7 text-slate-700">{item.fact[quizLanguage]}</p>
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
  copy: typeof quizCopy.en | typeof quizCopy.vi;
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
  options: readonly string[];
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
          <option key={option} value={option}>
            {option}
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
