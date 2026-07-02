export type LanguageCode = "en" | "vi";

export const languageNames: Record<LanguageCode, string> = {
  en: "English",
  vi: "Tiếng Việt",
};

export const uiText = {
  en: {
    navSubtitle: "CA-45 youth navigator",
    openNavigation: "Open navigation",
    languageToggle: "Language",
    crisisTitle: "In immediate danger or thinking about suicide?",
    crisisBody:
      "Call or text 988 now. Vietnamese interpretation is available by request. If there is immediate physical danger, call 911.",
    crisisBodyCompact: "Call or text 988 now. Vietnamese interpretation is available by request.",
    call988: "Call 988",
    privacyTitle: "Privacy promise",
    privacyBody:
      "Cầu Nối does not ask for names, emails, school IDs, addresses, immigration status, or medical record numbers. Tools are designed for anonymous guidance.",
    footerAbout: "About",
    footerResources: "Resources",
    footerQuiz: "Quiz",
  },
  vi: {
    navSubtitle: "Điều hướng hỗ trợ cho thanh thiếu niên CA-45",
    openNavigation: "Mở menu",
    languageToggle: "Ngôn ngữ",
    crisisTitle: "Bạn đang gặp nguy hiểm ngay lập tức hoặc đang nghĩ đến tự tử?",
    crisisBody:
      "Hãy gọi hoặc nhắn tin 988 ngay. Có thể yêu cầu thông dịch tiếng Việt. Nếu có nguy hiểm về thể chất ngay lập tức, hãy gọi 911.",
    crisisBodyCompact: "Hãy gọi hoặc nhắn tin 988 ngay. Có thể yêu cầu thông dịch tiếng Việt.",
    call988: "Gọi 988",
    privacyTitle: "Cam kết riêng tư",
    privacyBody:
      "Cầu Nối không hỏi tên, email, mã số học sinh, địa chỉ, tình trạng di trú, hoặc số hồ sơ y tế. Các công cụ được thiết kế để hướng dẫn ẩn danh.",
    footerAbout: "Giới thiệu",
    footerResources: "Nguồn hỗ trợ",
    footerQuiz: "Khảo sát",
  },
} as const;

export const navTranslations = {
  en: {
    home: "Home",
    resources: "Resources",
    conversation: "Conversation",
    quiz: "Quiz",
    dashboard: "Dashboard",
    map: "Map",
    about: "About",
  },
  vi: {
    home: "Trang chủ",
    resources: "Nguồn hỗ trợ",
    conversation: "Trò chuyện gia đình",
    quiz: "Khảo sát định kiến",
    dashboard: "Cộng đồng",
    map: "Bản đồ",
    about: "Giới thiệu",
  },
} as const;

export function pick<T>(language: LanguageCode, text: { en: T; vi: T }) {
  return text[language];
}
