export type Dictionary = "en";
import en from "./en/en.json";

const dictionaries = {
  en,
};

export const getDictionaryClient = (locale: Dictionary) => {
  const dictionaryLocale = dictionaries[locale] ? locale : "en";
  return dictionaries[dictionaryLocale];
};
