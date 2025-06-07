import { useTranslations } from "next-intl";

export default function Instructions() {
  const t = useTranslations("instructionsPage");
  return (
    <div>
      <h1>{t("title")}</h1>
    </div>
  );
}
