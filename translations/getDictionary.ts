import { notFound } from "next/navigation";

export type Dictionary = "en";

const dictionaries = {
  en: () => import("./en/en.json").then((module) => module.default),
};

export const getDictionary = async (locale: Dictionary) => {
  const languages: Set<Dictionary> = new Set<Dictionary>(["en"]);
  if (!languages.has(locale)) {
    notFound();
  }
  const dictionaryLocale = dictionaries[locale] ? locale : "en";
  return dictionaries[dictionaryLocale]();
};
