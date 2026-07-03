"use client";

import Link from "next/link";
import { BookOpen, Copy, MessageCircleHeart, RefreshCw, Route, Sparkles } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { incrementImpact } from "@/lib/impact";

const copy = {
  en: {
    choose: "Choose who you want to talk to",
    dialogue: "Practice dialogue",
    english: "English",
    vietnamese: "Vietnamese",
    feedback: "Supportive feedback",
    alternative: "Alternative response",
    next: "Helpful next step",
    copy: "Copy dialogue",
    reset: "Try another scenario",
    note:
      "Practice is not about perfect words. It is about starting with respect, naming one feeling, and asking for one realistic next step.",
  },
  vi: {
    choose: "Chọn người bạn muốn nói chuyện",
    dialogue: "Đoạn hội thoại luyện tập",
    english: "Tiếng Anh",
    vietnamese: "Tiếng Việt",
    feedback: "Góp ý hỗ trợ",
    alternative: "Cách trả lời khác",
    next: "Bước tiếp theo hữu ích",
    copy: "Sao chép hội thoại",
    reset: "Thử tình huống khác",
    note:
      "Luyện tập không phải để nói hoàn hảo. Mục tiêu là bắt đầu bằng sự tôn trọng, gọi tên một cảm xúc, và xin một bước hỗ trợ cụ thể.",
  },
} as const;

const scenarios = [
  {
    id: "parent",
    label: { en: "Parent", vi: "Cha mẹ" },
    context: { en: "Opening up at home", vi: "Mở lời ở nhà" },
    english: [
      ["Youth", "I want to tell you something serious, but I am not blaming you. I have been feeling overwhelmed."],
      ["Parent", "I may not understand everything right away, but I want to listen first."],
      ["Youth", "Could we look for support together, maybe someone who understands our language and culture?"],
    ],
    vietnamese: [
      ["Con", "Con muốn nói với ba mẹ một chuyện nghiêm túc, nhưng con không trách ba mẹ. Dạo này con thấy quá tải."],
      ["Ba mẹ", "Ba mẹ có thể chưa hiểu hết ngay, nhưng ba mẹ muốn lắng nghe trước."],
      ["Con", "Mình có thể cùng tìm hỗ trợ, có thể là người hiểu ngôn ngữ và văn hóa của gia đình mình không?"],
    ],
    feedback: {
      en: "This works because it protects respect while still naming the need clearly.",
      vi: "Cách này hiệu quả vì vẫn giữ sự tôn trọng nhưng nói rõ nhu cầu hỗ trợ.",
    },
    alternative: {
      en: "If it feels too hard, start with: 'Can I have ten minutes where you only listen first?'",
      vi: "Nếu quá khó, có thể bắt đầu: 'Ba mẹ có thể cho con mười phút và chỉ lắng nghe trước không?'",
    },
    href: "/resources",
  },
  {
    id: "friend",
    label: { en: "Friend", vi: "Bạn bè" },
    context: { en: "Checking on someone", vi: "Hỏi thăm một người bạn" },
    english: [
      ["Youth", "I noticed you have seemed quieter lately. I care about you and wanted to check in."],
      ["Friend", "I do not really know what to say."],
      ["Youth", "That is okay. I can sit with you, and if this feels unsafe, we can tell a trusted adult together."],
    ],
    vietnamese: [
      ["Bạn", "Mình thấy dạo này bạn có vẻ im lặng hơn. Mình quan tâm nên muốn hỏi thăm."],
      ["Người bạn", "Mình cũng không biết phải nói gì."],
      ["Bạn", "Không sao. Mình có thể ngồi với bạn, và nếu không an toàn, tụi mình có thể nói với một người lớn đáng tin cùng nhau."],
    ],
    feedback: {
      en: "You are not becoming their therapist. You are listening and connecting them to support.",
      vi: "Bạn không cần trở thành nhà trị liệu. Bạn đang lắng nghe và giúp bạn mình kết nối với hỗ trợ.",
    },
    alternative: {
      en: "Try: 'Do you want advice, distraction, or someone to just listen?'",
      vi: "Thử nói: 'Bạn muốn mình góp ý, giúp bạn phân tâm, hay chỉ lắng nghe thôi?'",
    },
    href: "/quiz",
  },
  {
    id: "counselor",
    label: { en: "Counselor", vi: "Cố vấn học đường" },
    context: { en: "Asking for confidential help", vi: "Xin hỗ trợ riêng tư" },
    english: [
      ["Youth", "I am dealing with stress and I need help figuring out what support is available."],
      ["Counselor", "We can talk through options and what confidentiality means here."],
      ["Youth", "I would like support that can include my family carefully, but not before I am ready."],
    ],
    vietnamese: [
      ["Học sinh", "Em đang bị căng thẳng và cần giúp tìm những hỗ trợ có sẵn."],
      ["Cố vấn", "Mình có thể cùng xem các lựa chọn và nói rõ bảo mật nghĩa là gì ở đây."],
      ["Học sinh", "Em muốn có hỗ trợ có thể liên quan đến gia đình một cách cẩn thận, nhưng không trước khi em sẵn sàng."],
    ],
    feedback: {
      en: "This asks for help while naming privacy needs directly.",
      vi: "Cách này xin hỗ trợ và nói rõ nhu cầu riêng tư.",
    },
    alternative: {
      en: "Bring a note if speaking out loud feels difficult.",
      vi: "Nếu nói trực tiếp quá khó, hãy mang theo một tờ ghi chú.",
    },
    href: "/map",
  },
  {
    id: "teacher",
    label: { en: "Teacher", vi: "Giáo viên" },
    context: { en: "School stress", vi: "Áp lực học tập" },
    english: [
      ["Youth", "I want to do well, but my stress is affecting my focus. Could we talk about one manageable next step?"],
      ["Teacher", "Thank you for telling me. Let us look at what is most urgent first."],
      ["Youth", "I would also like help connecting with the counselor or wellness center."],
    ],
    vietnamese: [
      ["Học sinh", "Em muốn học tốt, nhưng căng thẳng đang ảnh hưởng đến sự tập trung. Mình có thể nói về một bước nhỏ trước được không ạ?"],
      ["Giáo viên", "Cảm ơn em đã nói. Mình xem điều gì gấp nhất trước nhé."],
      ["Học sinh", "Em cũng muốn được giúp kết nối với cố vấn hoặc trung tâm wellness của trường."],
    ],
    feedback: {
      en: "This keeps the conversation concrete and makes support easier to offer.",
      vi: "Cách này giữ cuộc trò chuyện cụ thể và giúp người lớn dễ hỗ trợ hơn.",
    },
    alternative: {
      en: "Ask for one adjustment, one deadline conversation, or one referral.",
      vi: "Hãy xin một điều chỉnh nhỏ, một cuộc nói chuyện về hạn nộp, hoặc một giới thiệu hỗ trợ.",
    },
    href: "/resources",
  },
  {
    id: "sibling",
    label: { en: "Sibling", vi: "Anh chị em" },
    context: { en: "Asking for backup", vi: "Nhờ người trong nhà hỗ trợ" },
    english: [
      ["Youth", "I want to talk to our parents, but I am nervous. Can you help me practice first?"],
      ["Sibling", "Yes. What do you most want them to understand?"],
      ["Youth", "That I need support, not judgment, and that I still respect our family."],
    ],
    vietnamese: [
      ["Em", "Em muốn nói chuyện với ba mẹ, nhưng em hồi hộp. Anh/chị có thể tập với em trước không?"],
      ["Anh/chị", "Được. Điều gì em muốn ba mẹ hiểu nhất?"],
      ["Em", "Rằng em cần được hỗ trợ, không phải bị phán xét, và em vẫn tôn trọng gia đình mình."],
    ],
    feedback: {
      en: "A sibling can help bridge generations and reduce the fear of starting alone.",
      vi: "Anh chị em có thể làm nhịp nối giữa các thế hệ và giúp bạn bớt sợ khi bắt đầu một mình.",
    },
    alternative: {
      en: "Ask them to sit nearby, help translate one phrase, or check in after the conversation.",
      vi: "Có thể nhờ anh/chị ngồi gần, giúp dịch một câu, hoặc hỏi thăm sau cuộc trò chuyện.",
    },
    href: "/conversation",
  },
];

export function ConversationHelper() {
  const { language } = useLanguage();
  const text = copy[language as keyof typeof copy] ?? copy.en;
  const scenarioLanguage = language === "vi" ? "vi" : "en";
  const [activeId, setActiveId] = useState("parent");
  const active = scenarios.find((scenario) => scenario.id === activeId) ?? scenarios[0];

  const chooseScenario = (id: string) => {
    setActiveId(id);
    incrementImpact("conversationsPracticed");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
          <Sparkles size={18} className="text-teal-700" aria-hidden="true" />
          {text.choose}
        </p>
        <div className="grid gap-2">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => chooseScenario(scenario.id)}
              className={`rounded-md border px-3 py-3 text-left text-sm transition ${
                activeId === scenario.id
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-teal-50"
              }`}
            >
              <span className="block font-semibold">{scenario.label[scenarioLanguage]}</span>
              <span className={activeId === scenario.id ? "text-teal-50" : "text-slate-500"}>{scenario.context[scenarioLanguage]}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="grid gap-4">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">{text.dialogue}</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">{active.label[scenarioLanguage]}</h2>
            </div>
            <button
              type="button"
              onClick={() =>
                navigator.clipboard?.writeText(
                  [...active.english.map((line) => `${line[0]}: ${line[1]}`), "", ...active.vietnamese.map((line) => `${line[0]}: ${line[1]}`)].join("\n"),
                )
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-teal-50"
            >
              <Copy size={16} aria-hidden="true" />
              {text.copy}
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <DialogueColumn title={text.english} lines={active.english} />
            <DialogueColumn title={text.vietnamese} lines={active.vietnamese} />
          </div>
        </article>

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard icon={MessageCircleHeart} title={text.feedback} body={active.feedback[scenarioLanguage]} />
          <InfoCard icon={RefreshCw} title={text.alternative} body={active.alternative[scenarioLanguage]} />
          <Link href={active.href} className="rounded-lg border border-slate-200 bg-[#f6faf7] p-5 shadow-sm transition hover:border-teal-300 hover:bg-teal-50">
            <Route size={20} className="text-teal-700" aria-hidden="true" />
            <h3 className="mt-3 font-semibold text-slate-950">{text.next}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text.note}</p>
          </Link>
        </div>

        <Link href="/quiz" className="inline-flex w-fit items-center gap-2 rounded-md border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50">
          <BookOpen size={16} aria-hidden="true" />
          Stigma Quiz
        </Link>
      </section>
    </div>
  );
}

function DialogueColumn({ title, lines }: { title: string; lines: string[][] }) {
  return (
    <section className="rounded-lg bg-[#f6faf7] p-4">
      <h3 className="font-semibold text-teal-900">{title}</h3>
      <div className="mt-3 grid gap-3">
        {lines.map(([speaker, text]) => (
          <div key={`${speaker}-${text}`} className="rounded-md bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">{speaker}</p>
            <p className="mt-1 leading-7 text-slate-700">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function InfoCard({ icon: Icon, title, body }: { icon: typeof MessageCircleHeart; title: string; body: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Icon size={20} className="text-teal-700" aria-hidden="true" />
      <h3 className="mt-3 font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}
