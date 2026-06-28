"use client";

import { Copy, MessageCircleHeart } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const helperCopy = {
  en: {
    eyebrow: "Conversation starter",
    english: "English",
    vietnamese: "Vietnamese",
    copy: "Copy conversation text",
    noteTitle: "Cultural care note",
    note:
      "These starters are meant to reduce shame, protect respect, and open communication. Families may adapt words to match their own tone, faith, and relationship.",
  },
  vi: {
    eyebrow: "Gợi ý mở lời",
    english: "Tiếng Anh",
    vietnamese: "Tiếng Việt",
    copy: "Sao chép nội dung trò chuyện",
    noteTitle: "Ghi chú về sự tôn trọng văn hóa",
    note:
      "Những câu gợi ý này nhằm giảm cảm giác xấu hổ, giữ sự tôn trọng, và mở đường cho đối thoại. Mỗi gia đình có thể điều chỉnh lời nói cho hợp với cách xưng hô, niềm tin, và mối quan hệ của mình.",
  },
} as const;

const scenarios = [
  {
    title: { en: "Anxiety", vi: "Lo âu" },
    english:
      "I have been feeling anxious in a way that is hard to control. I am not blaming anyone. I want us to look for one small step that can help me feel safer and more steady.",
    vietnamese:
      "Dạo này con thấy lo âu và rất khó tự kiểm soát. Con không trách ai hết. Con muốn gia đình mình cùng tìm một bước nhỏ để con cảm thấy an toàn và vững hơn.",
  },
  {
    title: { en: "School stress", vi: "Áp lực học tập" },
    english:
      "I know school matters to our family. I am trying, but the pressure has been affecting my sleep and focus. Can we talk about support, not only grades?",
    vietnamese:
      "Con biết việc học rất quan trọng với gia đình mình. Con vẫn đang cố gắng, nhưng áp lực đang ảnh hưởng đến giấc ngủ và sự tập trung của con. Mình có thể nói về cách hỗ trợ con, chứ không chỉ nói về điểm số, được không?",
  },
  {
    title: { en: "Depression", vi: "Trầm buồn kéo dài" },
    english:
      "I have not felt like myself for a while. I still love our family, but everyday things feel heavy. I think talking with someone trained could help.",
    vietnamese:
      "Một thời gian rồi con không còn thấy giống chính mình. Con vẫn thương gia đình mình, nhưng những việc hằng ngày trở nên rất nặng nề. Con nghĩ nói chuyện với một người có chuyên môn có thể giúp con.",
  },
  {
    title: { en: "Asking for therapy", vi: "Xin được đi tư vấn/trị liệu" },
    english:
      "Therapy does not mean our family failed. It can be a private place for me to learn coping skills and communicate better at home. Can you help me explore options?",
    vietnamese:
      "Đi tư vấn hoặc trị liệu không có nghĩa là gia đình mình thất bại. Đó có thể là một nơi riêng tư để con học cách đối phó và giao tiếp tốt hơn ở nhà. Ba mẹ có thể giúp con tìm lựa chọn phù hợp không?",
  },
  {
    title: { en: "Talking to traditional parents", vi: "Nói chuyện với cha mẹ truyền thống" },
    english:
      "I respect our family values and the sacrifices you made. I also need support for my mental health. Getting help can be part of taking care of our family, not turning away from it.",
    vietnamese:
      "Con tôn trọng giá trị gia đình mình và những hy sinh của ba mẹ. Đồng thời, con cũng cần được hỗ trợ về sức khỏe tinh thần. Tìm sự giúp đỡ có thể là một cách chăm sóc gia đình mình, chứ không phải quay lưng với gia đình.",
  },
  {
    title: { en: "When parents worry about privacy", vi: "Khi cha mẹ lo về chuyện riêng tư" },
    english:
      "I understand you want to protect me. I also need a safe space to speak honestly. Unless I am in immediate danger, can we agree to ask before sharing my story with others?",
    vietnamese:
      "Con hiểu ba mẹ muốn bảo vệ con. Con cũng cần một nơi an toàn để nói thật lòng. Trừ khi con đang gặp nguy hiểm ngay lập tức, mình có thể thống nhất là sẽ hỏi con trước khi kể chuyện của con cho người khác không?",
  },
];

export function ConversationHelper() {
  const { language } = useLanguage();
  const copy = helperCopy[language];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {scenarios.map((scenario) => (
        <ConversationCard
          key={scenario.title.en}
          title={scenario.title[language]}
          eyebrow={copy.eyebrow}
          englishLabel={copy.english}
          vietnameseLabel={copy.vietnamese}
          copyLabel={copy.copy}
          english={scenario.english}
          vietnamese={scenario.vietnamese}
        />
      ))}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950 md:col-span-2">
        <p className="flex items-center gap-2 font-semibold">
          <MessageCircleHeart size={18} aria-hidden="true" />
          {copy.noteTitle}
        </p>
        <p className="mt-2 text-sm leading-6">{copy.note}</p>
      </div>
    </div>
  );
}

function ConversationCard({
  title,
  eyebrow,
  englishLabel,
  vietnameseLabel,
  copyLabel,
  english,
  vietnamese,
}: {
  title: string;
  eyebrow: string;
  englishLabel: string;
  vietnameseLabel: string;
  copyLabel: string;
  english: string;
  vietnamese: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">{title}</h2>
        </div>
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(`${english}\n\n${vietnamese}`)}
          className="grid size-10 shrink-0 place-items-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-teal-50"
          title={copyLabel}
        >
          <Copy size={17} aria-hidden="true" />
          <span className="sr-only">{copyLabel}</span>
        </button>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <section className="rounded-md bg-[#f6faf7] p-4">
          <h3 className="text-sm font-semibold text-teal-900">{englishLabel}</h3>
          <p className="mt-2 leading-7 text-slate-800">{english}</p>
        </section>
        <section className="rounded-md bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">{vietnameseLabel}</h3>
          <p className="mt-2 leading-7 text-slate-700">{vietnamese}</p>
        </section>
      </div>
    </article>
  );
}
