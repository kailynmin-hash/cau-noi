"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type TextSize = "small" | "default" | "large" | "extra-large";

type AccessibilitySettings = {
  dyslexiaFont: boolean;
  highContrast: boolean;
  textSize: TextSize;
  reduceMotion: boolean;
};

type AccessibilityContextValue = {
  settings: AccessibilitySettings;
  setTextSize: (textSize: TextSize) => void;
  toggleDyslexiaFont: () => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  resetSettings: () => void;
};

const storageKey = "cau-noi-accessibility-settings";

const defaultSettings: AccessibilitySettings = {
  dyslexiaFont: false,
  highContrast: false,
  textSize: "default",
  reduceMotion: false,
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window === "undefined") return defaultSettings;

    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) return defaultSettings;
      return normalizeSettings(JSON.parse(saved));
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.textSize = settings.textSize;
    root.dataset.dyslexiaFont = String(settings.dyslexiaFont);
    root.dataset.highContrast = String(settings.highContrast);
    root.dataset.reduceMotion = String(settings.reduceMotion);
    root.classList.toggle("a11y-dyslexia-font", settings.dyslexiaFont);
    root.classList.toggle("a11y-high-contrast", settings.highContrast);
    root.classList.toggle("a11y-reduce-motion", settings.reduceMotion);
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      settings,
      setTextSize: (textSize) => setSettings((current) => ({ ...current, textSize })),
      toggleDyslexiaFont: () => setSettings((current) => ({ ...current, dyslexiaFont: !current.dyslexiaFont })),
      toggleHighContrast: () => setSettings((current) => ({ ...current, highContrast: !current.highContrast })),
      toggleReduceMotion: () => setSettings((current) => ({ ...current, reduceMotion: !current.reduceMotion })),
      resetSettings: () => setSettings(defaultSettings),
    }),
    [settings],
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
}

function normalizeSettings(value: unknown): AccessibilitySettings {
  if (!value || typeof value !== "object") return defaultSettings;
  const candidate = value as Partial<AccessibilitySettings>;

  return {
    dyslexiaFont: Boolean(candidate.dyslexiaFont),
    highContrast: Boolean(candidate.highContrast),
    textSize: isTextSize(candidate.textSize) ? candidate.textSize : defaultSettings.textSize,
    reduceMotion: Boolean(candidate.reduceMotion),
  };
}

function isTextSize(value: unknown): value is TextSize {
  return value === "small" || value === "default" || value === "large" || value === "extra-large";
}
