import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "kz", "ru"],
  defaultLocale: "ru",
  localeDetection: true,
});
