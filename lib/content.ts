import {
  BookOpen,
  Brain,
  CalendarHeart,
  HandHeart,
  HeartHandshake,
  Home,
  Languages,
  MapPin,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const navItems = [
  { href: "/", key: "home" },
  { href: "/resources", key: "resources" },
  { href: "/conversation", key: "conversation" },
  { href: "/quiz", key: "quiz" },
  { href: "/dashboard", key: "dashboard" },
  { href: "/map", key: "map" },
  { href: "/accessibility", key: "accessibility" },
] as const;

export const pathways = [
  {
    icon: Brain,
    title: "I am worried about myself",
    vi: "Em lo cho chinh minh",
    text: "Find private, immediate, and school-based next steps without sharing your identity.",
  },
  {
    icon: Users,
    title: "I am worried about a friend",
    vi: "Em lo cho mot nguoi ban",
    text: "Use simple scripts, warning signs, and crisis options to support someone safely.",
  },
  {
    icon: Home,
    title: "I need to talk with family",
    vi: "Em can noi chuyen voi gia dinh",
    text: "Practice culturally respectful phrases in English and Vietnamese before a hard conversation.",
  },
];

export const dashboardStats = [
  { label: "Local youth-friendly resources", value: "24+", icon: MapPin },
  { label: "No personal data collected", value: "0", icon: ShieldCheck },
  { label: "Bilingual conversation prompts", value: "36", icon: Languages },
  { label: "Crisis support access", value: "24/7", icon: CalendarHeart },
];

export const supportTopics = [
  { label: "Stress / Cang thang", value: 82 },
  { label: "Family pressure / Ap luc gia dinh", value: 74 },
  { label: "School anxiety / Lo au hoc duong", value: 69 },
  { label: "Loneliness / Co don", value: 58 },
  { label: "Sleep / Giac ngu", value: 51 },
];

export const conversationPrompts = [
  {
    scenario: "Anxiety",
    english:
      "I have been feeling nervous in a way that is hard to control. I am not trying to be dramatic. I want help finding one small next step.",
    vietnamesePlaceholder:
      "[Vietnamese placeholder] Con dang cam thay lo lang va kho kiem soat. Con khong lam qua van de. Con muon duoc giup tim mot buoc nho tiep theo.",
  },
  {
    scenario: "School stress",
    english:
      "School pressure has been building up, and I am having trouble resting and focusing. Can we talk about support instead of only grades?",
    vietnamesePlaceholder:
      "[Vietnamese placeholder] Ap luc hoc tap dang tang len, va con kho nghi ngoi hay tap trung. Minh co the noi ve su ho tro, khong chi ve diem so, duoc khong?",
  },
  {
    scenario: "Depression",
    english:
      "I have not felt like myself for a while. Things that used to feel normal now feel heavy. I think I should talk to someone trained.",
    vietnamesePlaceholder:
      "[Vietnamese placeholder] Gan day con khong cam thay la chinh minh. Nhung viec tung binh thuong bay gio thay rat nang ne. Con nghi con nen noi chuyen voi nguoi co chuyen mon.",
  },
  {
    scenario: "Asking for therapy",
    english:
      "I want to try therapy because I need a safe place to talk and learn coping skills. I would like your help looking for options.",
    vietnamesePlaceholder:
      "[Vietnamese placeholder] Con muon thu tri lieu vi con can mot noi an toan de noi chuyen va hoc cach doi pho. Con muon ba/me giup con tim lua chon phu hop.",
  },
  {
    scenario: "Talking to traditional parents",
    english:
      "I respect our family values, and I also need support for my mental health. Getting help does not mean our family failed.",
    vietnamesePlaceholder:
      "[Vietnamese placeholder] Con ton trong gia tri gia dinh minh, va con cung can duoc ho tro ve suc khoe tam than. Tim su giup do khong co nghia la gia dinh minh that bai.",
  },
];

export const quizQuestions = [
  {
    statement: "A student who needs counseling is probably weak.",
    myth: "Needing counseling means someone is weak.",
    fact:
      "Counseling is a support tool, like tutoring for emotional skills. Asking early often prevents bigger crises.",
  },
  {
    statement: "Talking about mental health can bring shame to a family.",
    myth: "Mental-health conversations are shameful.",
    fact:
      "Private, respectful conversations can protect family wellbeing and help someone get support before problems grow.",
  },
  {
    statement: "If someone mentions suicide, it is better not to ask about it directly.",
    myth: "Asking about suicide makes things worse.",
    fact:
      "Asking directly and connecting someone to immediate support can reduce danger. In the U.S., call or text 988.",
  },
  {
    statement: "A friend should handle a mental-health concern alone if they want privacy.",
    myth: "Privacy means handling everything alone.",
    fact:
      "Privacy matters, but support can still include trusted adults, counselors, crisis lines, and boundaries.",
  },
  {
    statement: "Therapy is only for people with severe mental illness.",
    myth: "Therapy is only for extreme situations.",
    fact:
      "Therapy can help with stress, anxiety, grief, family conflict, identity questions, sleep, and coping skills.",
  },
  {
    statement: "Strong students should be able to push through anxiety without help.",
    myth: "Achievement means a student should not need help.",
    fact:
      "High-achieving students can still experience anxiety. Support can improve health, focus, and long-term resilience.",
  },
  {
    statement: "Cultural respect and professional mental-health care cannot work together.",
    myth: "Care and culture are incompatible.",
    fact:
      "Good care can respect language, family roles, faith, immigration stress, privacy, and cultural values.",
  },
  {
    statement: "If I cannot find the perfect words, I should avoid the conversation.",
    myth: "Hard conversations require perfect words.",
    fact:
      "Starting simply is enough: say what you notice, ask what support is wanted, and connect to help if safety is urgent.",
  },
];

export const featureCards = [
  { icon: HeartHandshake, title: "Culturally aware", text: "Built for Vietnamese American families and all CA-45 youth." },
  { icon: MessageCircleHeart, title: "Conversation first", text: "Scripts help teens and caregivers talk before a crisis grows." },
  { icon: BookOpen, title: "Plain language", text: "Every core tool uses practical English and Vietnamese side by side." },
  { icon: Sparkles, title: "Private by design", text: "No accounts, no names, no emails, and no identifying form fields." },
  { icon: HandHeart, title: "Action oriented", text: "Each page points toward a small, realistic next step." },
];
