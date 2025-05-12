"use client";

import Logo from "../Logo/Logo";
import "./Header.scss";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useRouter, usePathname } from "next/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations, useLocale } from "use-intl";

const Header = () => {
  const user = useAppSelector((state) => state.user.user);
  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Function to handle language change
  const handleLocaleChange = (newLocale: string) => {
    // Extract the path without the locale prefix
    let pathWithoutLocale = pathname;
    const pathParts = pathname.split("/");

    if (["en", "ru", "kz"].includes(pathParts[1])) {
      pathWithoutLocale = "/" + pathParts.slice(2).join("/");
    }

    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <header>
      {!user ? (
        <Logo />
      ) : (
        <Link
          href={`/${locale}/profile`}
          className="user"
        >
          {user.first_name} {user.last_name}
        </Link>
      )}

      <LanguageSwitcher
        currentLocale={locale}
        onChange={handleLocaleChange}
      />
    </header>
  );
};

export default Header;
