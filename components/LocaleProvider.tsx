"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Content } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";

type Value = { locale: Locale; site: Content["site"]; ui: Content["ui"] };

const LocaleContext = createContext<Value | null>(null);

/** Gives client components the current language, the shared site details and the UI wording. */
export default function LocaleProvider({ value, children }: { value: Value; children: ReactNode }) {
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used inside <LocaleProvider>");
  return { ...value, href: (path: string) => localePath(value.locale, path) };
}
