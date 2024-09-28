import moment from "moment";
import "moment/locale/de";
import "moment/locale/en-gb";
import "dayjs/locale/de";
import dayjs from "dayjs";

import de from "./i18n/de.json";
import en from "./i18n/en.json";
import { createIntl, createIntlCache } from "react-intl";
import countries from "i18n-iso-countries";

export const messages: any = {
  de,
  en,
};

export const lang: string = (
  localStorage.getItem("locale") ||
  (navigator.language.split(/[-_]/)[0] !== "de" ? "en" : "de")
).toLowerCase(); // language without region code

localStorage.getItem("locale") || localStorage.setItem("locale", lang);

moment.locale(lang);
dayjs.locale(lang);
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/de.json"));

export const localeMap: any = {
  en: "en",
  de: "de",
};

const cache = createIntlCache(); // prevent memleaks
export const intl = createIntl(
  {
    locale: lang,
    // Locale of the fallback defaultMessage
    defaultLocale: "de",
    messages: messages[lang.toLowerCase()],
  },
  cache
);
