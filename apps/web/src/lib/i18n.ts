export const messages = {
  en: {
    balance: "Balance",
    popularCases: "Popular cases",
    openFor: "Open for",
    liveOpenings: "Live openings"
  },
  ru: {
    balance: "Баланс",
    popularCases: "Популярные кейсы",
    openFor: "Открыть за",
    liveOpenings: "Лента открытий"
  },
  ua: {
    balance: "Баланс",
    popularCases: "Популярні кейси",
    openFor: "Вiдкрити за",
    liveOpenings: "Стрiчка вiдкриттiв"
  }
} as const;

export type Locale = keyof typeof messages;

export function getMessages(locale: string | undefined) {
  if (locale === "ru" || locale === "ua") return messages[locale];
  return messages.en;
}
