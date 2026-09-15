import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";

export const RTL_LANGUAGES = ["ar"];
export const SUPPORTED_LANGUAGES = ["fr", "ar"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
const LANG_STORAGE_KEY = "houni_lang";

function getStoredLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "fr";
  const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
  return stored === "ar" ? "ar" : "fr";
}

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources: {
      fr: { translation: fr },
      ar: { translation: ar },
    },
    lng: getStoredLanguage(),
    fallbackLng: "fr",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export function setLanguage(lang: SupportedLanguage) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    // Reload rather than rely on every subscribed component re-rendering live —
    // guarantees the whole tree (including anything nested in Suspense) reflects
    // the new language consistently, at the cost of a full page refresh.
    window.location.reload();
  }
}

export default i18next;
