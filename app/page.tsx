"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Brain, HandHeart, HeartHandshake, HomeIcon, LockKeyhole, MessageCircleHeart, Sparkles, Users } from "lucide-react";
import { HomeShowcase } from "@/components/HomeShowcase";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";

const homeCopy = {
  en: {
    eyebrow: "Cầu Nối means bridge",
    title: "A bilingual mental-health navigator for CA-45 youth.",
    subtitle: "Support in English and Vietnamese for youth, families, and trusted adults.",
    intro:
      "Find support, practice family conversations, challenge stigma, and see community needs without creating an account or sharing identifying information.",
    primary: "Find support",
    secondary: "Practice a conversation",
    pathTitle: "Choose your path",
    pathIntro: "Start with what feels closest to your situation. You can move around freely.",
    trustTitle: "Built for trust",
    privacy:
      "No login, no tracking forms, no names, no emails. Cầu Nối is a navigator, not a medical diagnosis tool.",
    bilingualTitle: "Why bilingual resources matter",
    bilingualBody:
      "Vietnamese-American youth may describe stress, sadness, or anxiety differently at school than at home. Immigrant parents may care deeply but have fewer familiar words for therapy, confidentiality, or crisis support. Bilingual resources help both generations slow down, understand each other, and find help without shame.",
    ca45Title: "Why This Matters in CA-45",
    ca45Intro:
      "CA-45 includes many immigrant families, students, caregivers, and community organizations working to support youth wellbeing. Cầu Nối focuses on community needs, youth voice, and access to care.",
    ca45Cards: [
      [
        "Access barriers",
        "Immigrant families may face cost concerns, transportation limits, unfamiliar systems, privacy worries, or uncertainty about which services are safe and appropriate for youth.",
      ],
      [
        "Language and stigma",
        "A teen may know how to describe stress in English at school, while a parent may be more comfortable in Vietnamese. Stigma can make both generations avoid the conversation.",
      ],
      [
        "Culturally responsive care",
        "Helpful support respects language, family roles, faith, privacy, and lived experience while still giving youth a clear path to professional care when needed.",
      ],
      [
        "Anonymous community data",
        "Anonymous survey responses help identify access gaps, such as language barriers or low awareness of resources, without asking for names, school names, contact details, or immigration status.",
      ],
    ],
    focusTitle: "Congressional App Challenge focus",
    focusLabel: "Youth mental-health access",
    focusBody:
      "The app centers youth who may feel caught between school stress, family expectations, language access, stigma, and uncertainty about where to begin. Every feature gives a concrete next step while respecting privacy and cultural context.",
    pathways: [
      ["I am worried about myself", "Find private, immediate, and school-based next steps without sharing your identity."],
      ["I am worried about a friend", "Use simple scripts, warning signs, and crisis options to support someone safely."],
      ["I need to talk with family", "Practice culturally respectful phrases in English and Vietnamese before a hard conversation."],
    ],
    features: [
      ["Culturally aware", "Built for Vietnamese-American families and all CA-45 youth."],
      ["Conversation first", "Scripts help teens and caregivers talk before a crisis grows."],
      ["Plain language", "Every core tool uses practical English and Vietnamese."],
      ["Private by design", "No accounts, no names, no emails, and no identifying form fields."],
      ["Action oriented", "Each page points toward a small, realistic next step."],
    ],
  },
  vi: {
    eyebrow: "Cầu Nối nghĩa là bridge, một nhịp nối",
    title: "Công cụ điều hướng sức khỏe tinh thần song ngữ cho thanh thiếu niên CA-45.",
    subtitle: "Hỗ trợ bằng tiếng Anh và tiếng Việt cho các em, gia đình, và người lớn đáng tin cậy.",
    intro:
      "Tìm nguồn hỗ trợ, tập nói chuyện với gia đình, giảm định kiến, và xem nhu cầu cộng đồng mà không cần tạo tài khoản hay chia sẻ thông tin định danh.",
    primary: "Tìm hỗ trợ",
    secondary: "Tập trò chuyện",
    pathTitle: "Chọn hướng phù hợp",
    pathIntro: "Bắt đầu từ điều gần nhất với hoàn cảnh của bạn. Bạn có thể chuyển trang bất cứ lúc nào.",
    trustTitle: "Thiết kế để tạo niềm tin",
    privacy:
      "Không cần đăng nhập, không có biểu mẫu theo dõi, không hỏi tên hay email. Cầu Nối là công cụ điều hướng, không phải công cụ chẩn đoán y khoa.",
    bilingualTitle: "Vì sao nguồn hỗ trợ song ngữ quan trọng",
    bilingualBody:
      "Thanh thiếu niên gốc Việt có thể nói về căng thẳng, buồn bã, hoặc lo âu ở trường khác với cách nói ở nhà. Cha mẹ di dân có thể rất thương con nhưng chưa quen với các khái niệm như trị liệu, bảo mật, hoặc hỗ trợ khủng hoảng. Tài nguyên song ngữ giúp hai thế hệ hiểu nhau hơn, nói chuyện chậm rãi hơn, và tìm sự giúp đỡ mà không cảm thấy xấu hổ.",
    ca45Title: "Vì sao điều này quan trọng ở CA-45",
    ca45Intro:
      "CA-45 có nhiều gia đình di dân, học sinh, người chăm sóc, và tổ chức cộng đồng đang cùng hỗ trợ sức khỏe của thanh thiếu niên. Cầu Nối tập trung vào nhu cầu cộng đồng, tiếng nói của youth, và khả năng tiếp cận chăm sóc.",
    ca45Cards: [
      [
        "Rào cản tiếp cận",
        "Gia đình di dân có thể lo về chi phí, đi lại, hệ thống dịch vụ còn lạ, quyền riêng tư, hoặc không biết dịch vụ nào an toàn và phù hợp cho thanh thiếu niên.",
      ],
      [
        "Ngôn ngữ và định kiến",
        "Một em có thể biết cách nói về căng thẳng bằng tiếng Anh ở trường, trong khi cha mẹ thoải mái hơn bằng tiếng Việt. Định kiến có thể khiến cả hai thế hệ né tránh cuộc trò chuyện.",
      ],
      [
        "Chăm sóc phù hợp văn hóa",
        "Sự hỗ trợ hiệu quả tôn trọng ngôn ngữ, vai trò gia đình, niềm tin, sự riêng tư, và trải nghiệm sống, đồng thời vẫn giúp các em biết đường tìm chăm sóc chuyên môn khi cần.",
      ],
      [
        "Dữ liệu cộng đồng ẩn danh",
        "Phản hồi khảo sát ẩn danh giúp nhận ra khoảng trống tiếp cận, như rào cản ngôn ngữ hoặc việc chưa biết nguồn hỗ trợ, mà không hỏi tên, tên trường, thông tin liên lạc, hoặc tình trạng di trú.",
      ],
    ],
    focusTitle: "Trọng tâm Congressional App Challenge",
    focusLabel: "Tiếp cận hỗ trợ sức khỏe tinh thần cho thanh thiếu niên",
    focusBody:
      "Ứng dụng tập trung vào các em có thể đang kẹt giữa áp lực học tập, kỳ vọng gia đình, rào cản ngôn ngữ, định kiến, và không biết bắt đầu từ đâu. Mỗi tính năng đưa ra một bước nhỏ, cụ thể, đồng thời tôn trọng sự riêng tư và bối cảnh văn hóa.",
    pathways: [
      ["Em đang lo cho chính mình", "Tìm bước hỗ trợ riêng tư, khẩn cấp, hoặc trong trường học mà không cần chia sẻ danh tính."],
      ["Em đang lo cho một người bạn", "Dùng lời gợi ý, dấu hiệu cảnh báo, và lựa chọn khủng hoảng để hỗ trợ bạn một cách an toàn."],
      ["Em cần nói chuyện với gia đình", "Tập những câu nói tôn trọng văn hóa bằng tiếng Anh và tiếng Việt trước một cuộc trò chuyện khó."],
    ],
    features: [
      ["Hiểu bối cảnh văn hóa", "Được xây dựng cho gia đình Việt-Mỹ và mọi thanh thiếu niên CA-45."],
      ["Ưu tiên trò chuyện", "Các câu gợi ý giúp teen và người chăm sóc nói chuyện trước khi khủng hoảng lớn hơn."],
      ["Ngôn ngữ dễ hiểu", "Các công cụ chính dùng tiếng Anh và tiếng Việt thực tế."],
      ["Riêng tư từ thiết kế", "Không tài khoản, không tên, không email, không biểu mẫu định danh."],
      ["Hướng đến hành động", "Mỗi trang đưa ra một bước nhỏ và khả thi."],
    ],
  },
} as const;

const pathIcons = [Brain, Users, HomeIcon];
const featureIcons = [HeartHandshake, MessageCircleHeart, BookOpen, Sparkles, HandHeart];

export default function Home() {
  const { language } = useLanguage();
  const copy = homeCopy[language];

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} vietnamese={copy.subtitle}>
        <p>{copy.intro}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/resources"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
          >
            {copy.primary}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link
            href="/conversation"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-teal-700 px-4 text-sm font-semibold text-teal-800 transition hover:bg-teal-50"
          >
            {copy.secondary}
          </Link>
        </div>
      </PageHero>

      <Section title={copy.pathTitle} intro={copy.pathIntro}>
        <div className="grid gap-4 md:grid-cols-3">
          {copy.pathways.map(([title, text], index) => {
            const Icon = pathIcons[index];
            return (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon size={24} className="text-teal-700" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-semibold text-slate-950">{title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </article>
            );
          })}
        </div>
      </Section>

      <Section tone="mist">
        <HomeShowcase />
      </Section>

      <Section title={copy.trustTitle} tone="mist">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {copy.features.map(([title, text], index) => {
            const Icon = featureIcons[index];
            return (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon size={22} className="text-teal-700" aria-hidden="true" />
                <h2 className="mt-4 font-semibold text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-lg bg-teal-800 p-5 text-white">
          <LockKeyhole className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
          <p className="text-sm leading-6 text-teal-50">{copy.privacy}</p>
        </div>
      </Section>

      <Section title={copy.bilingualTitle}>
        <p className="max-w-4xl rounded-lg border border-slate-200 bg-white p-5 leading-7 text-slate-700 shadow-sm">
          {copy.bilingualBody}
        </p>
      </Section>

      <Section title={copy.ca45Title} intro={copy.ca45Intro} tone="mist">
        <div className="grid gap-4 md:grid-cols-2">
          {copy.ca45Cards.map(([title, text]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <ImpactMetrics />
      </Section>

      <Section title={copy.focusTitle}>
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="flex min-h-64 items-center justify-center rounded-lg bg-[#dcefe6] p-8">
            <div className="text-center">
              <Sparkles size={42} className="mx-auto text-teal-800" aria-hidden="true" />
              <p className="mt-4 text-3xl font-semibold text-slate-950">CA-45</p>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-teal-800">{copy.focusLabel}</p>
            </div>
          </div>
          <p className="leading-7 text-slate-700">{copy.focusBody}</p>
        </div>
      </Section>
    </>
  );
}
