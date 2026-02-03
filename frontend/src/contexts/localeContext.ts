import { createContext } from "react";
import type { Locale, TranslationKey } from "../i18n/translations";

export const STORAGE_KEY = "app-locale";

export const getStoredLocale = (): Locale => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "ru" || stored === "en") return stored;
  return "en";
};

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

export const LocaleContext =
  createContext<LocaleContextValue | null>(null);
