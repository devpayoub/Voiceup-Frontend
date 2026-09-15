"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { RTL_LANGUAGES } from "@/lib/i18n";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = RTL_LANGUAGES.includes(i18n.language) ? "rtl" : "ltr";
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
