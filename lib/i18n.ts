import en from "@/locales/en.json";
import es from "@/locales/es.json";
import ja from "@/locales/ja.json";
import ko from "@/locales/ko.json";
import vi from "@/locales/vi.json";
import zh from "@/locales/zh.json";

export const languages = ["en", "vi", "es", "ko", "zh", "ja"] as const;
export type LanguageCode = (typeof languages)[number];

export const dictionaries = {
  en,
  vi,
  es,
  ko,
  zh,
  ja,
} as const;

export const languageNames: Record<LanguageCode, string> = en.languageNames;

export function isLanguageCode(value: string | null): value is LanguageCode {
  return !!value && languages.includes(value as LanguageCode);
}

export function getDictionary(language: LanguageCode) {
  return dictionaries[language] ?? dictionaries.en;
}

export function translate(language: LanguageCode, key: string): string {
  const localized = readPath(getDictionary(language), key);
  const fallback = readPath(dictionaries.en, key);
  if (typeof localized === "string" && localized.length > 0) return localized;
  if (typeof fallback === "string" && fallback.length > 0) return fallback;
  return key;
}

export function translateValue<T>(language: LanguageCode, key: string, fallbackValue: T): T {
  const localized = readPath(getDictionary(language), key);
  const fallback = readPath(dictionaries.en, key);
  return (localized ?? fallback ?? fallbackValue) as T;
}

export function localizedOption(language: LanguageCode, value: string) {
  const key = optionTranslationKeys[value];
  return key ? translate(language, key) : value;
}

const optionTranslationKeys: Record<string, string> = {
  "All languages": "filters.allLanguages",
  "All costs": "filters.allCosts",
  "All resource types": "filters.allResourceTypes",
  "Any format": "filters.anyFormat",
  "All cities": "filters.allCities",
  English: "filters.english",
  Vietnamese: "filters.vietnamese",
  Spanish: "filters.spanish",
  Korean: "filters.korean",
  Chinese: "filters.chinese",
  Japanese: "filters.japanese",
  Other: "filters.other",
};

function readPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, part) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[part];
  }, source);
}
