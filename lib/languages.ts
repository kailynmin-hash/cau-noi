export const supportedLanguages = [
  { code: "en", label: "🇺🇸 English", name: "English" },
  { code: "vi", label: "🇻🇳 Tiếng Việt", name: "Vietnamese" },
  { code: "es", label: "🇪🇸 Español", name: "Spanish" },
  { code: "ko", label: "🇰🇷 한국어", name: "Korean" },
  { code: "zh", label: "🇨🇳 简体中文", name: "Chinese (Simplified)" },
  { code: "zh-Hant", label: "🇹🇼 繁體中文", name: "Chinese (Traditional)" },
  { code: "ja", label: "🇯🇵 日本語", name: "Japanese" },
] as const;

export type LanguageCode = (typeof supportedLanguages)[number]["code"];

export const languages = supportedLanguages.map((language) => language.code) as LanguageCode[];

export const languageNames = Object.fromEntries(
  supportedLanguages.map((language) => [language.code, language.label]),
) as Record<LanguageCode, string>;

export const quizPreferredLanguageOptions = supportedLanguages.map((language) => ({
  value: language.name,
  label: language.label,
}));
