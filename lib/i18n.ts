import en from "@/locales/en.json";
import es from "@/locales/es.json";
import ja from "@/locales/ja.json";
import ko from "@/locales/ko.json";
import vi from "@/locales/vi.json";
import zh from "@/locales/zh.json";
import { languageNames, languages, type LanguageCode } from "@/lib/languages";

export { languageNames, languages, type LanguageCode };

export const dictionaries = {
  en,
  vi,
  es,
  ko,
  zh,
  "zh-Hant": zh,
  ja,
} as const;

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
  warnMissing(language, key);
  if (typeof fallback === "string" && fallback.length > 0) return fallback;
  return key;
}

export function translateValue<T>(language: LanguageCode, key: string, fallbackValue: T): T {
  const localized = readPath(getDictionary(language), key);
  const fallback = readPath(dictionaries.en, key);
  if (localized === undefined && language !== "en") warnMissing(language, key);
  return (localized ?? fallback ?? fallbackValue) as T;
}

export function localizedOption(language: LanguageCode, value: string) {
  const key = optionTranslationKeys[value];
  return key ? translate(language, key) : value;
}

export function resourceKey(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function localizedResource(language: LanguageCode, resource: { name: string; description: string; city: string; resourceType: string }) {
  const key = resourceKey(resource.name);
  return {
    name: translate(language, `resources.${key}.name`),
    description: translate(language, `resources.${key}.description`),
    city: translate(language, `resources.${key}.city`),
    category: translate(language, `resources.${key}.category`) || localizedOption(language, resource.resourceType),
  };
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
  Free: "filters.free",
  "Sliding Scale": "filters.slidingScale",
  "Insurance Accepted": "filters.insuranceAccepted",
  "In-Person": "filters.inPerson",
  Virtual: "filters.virtual",
  Hotline: "filters.hotline",
  Hybrid: "filters.hybrid",
  "Website coming soon": "common.websiteComingSoon",
  "988 Suicide & Crisis Lifeline": "resourceTypes.crisis",
  "Orange County Health Care Agency Behavioral Health Services": "resourceTypes.ocHca",
  "CHOC WellSpaces": "resourceTypes.choc",
  "School counselors and school wellness centers": "resourceTypes.school",
  "Teen peer support programs": "resourceTypes.peer",
  "Community clinics": "resourceTypes.clinics",
  "Family support resources": "resourceTypes.family",
  "Vietnamese-language mental-health resources": "resourceTypes.vietnamese",
};

function readPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, part) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[part];
  }, source);
}

function warnMissing(language: LanguageCode, key: string) {
  if (language === "en" || typeof window === "undefined" || process.env.NODE_ENV === "production") return;
  console.warn(`[i18n] Missing translation for "${key}" in "${language}". Falling back to English.`);
}
