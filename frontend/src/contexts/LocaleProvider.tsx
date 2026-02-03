import { useState, useCallback, useEffect } from "react";
import type { Locale, TranslationKey } from "../i18n/translations";
import { translations } from "../i18n/translations";
import {
  useGetMeQuery,
  useUpdateLocaleMutation,
} from "../store/api/authApi.js";
import { useAppSelector } from "../hooks";
import {
  LocaleContext,
  getStoredLocale,
  STORAGE_KEY,
} from "./localeContext";

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale);
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("token");
  const { data: meData } = useGetMeQuery(undefined, { skip: !hasToken });
  const authUser = useAppSelector((state) => state.auth.user);
  const [updateLocaleApi] = useUpdateLocaleMutation();

  // Sync locale from backend when logged in (from getMe or login/register response)
  useEffect(() => {
    const userLocale = meData?.user?.locale ?? authUser?.locale;
    if (userLocale && (userLocale === "ru" || userLocale === "en")) {
      queueMicrotask(() => {
        setLocaleState(userLocale);
        localStorage.setItem(STORAGE_KEY, userLocale);
      });
    }
  }, [meData?.user?.locale, authUser?.locale]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback(
    async (newLocale: Locale) => {
      setLocaleState(newLocale);
      if (hasToken) {
        try {
          await updateLocaleApi(newLocale).unwrap();
        } catch {
          // Error handled by baseApi, locale still updated locally
        }
      }
    },
    [hasToken, updateLocaleApi],
  );

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[locale][key] ?? key;
    },
    [locale],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};
