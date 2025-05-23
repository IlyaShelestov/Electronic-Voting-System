"use client";

import Logo from "../Logo/Logo";
import "./Header.scss";
import Link from "next/link";
import { useIsAuthenticated, useAppSelector } from "@/store/hooks";
import { useRouter, usePathname } from "next/navigation";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import { useLocale } from "use-intl";

const Header = () => {
  const user = useAppSelector((state) => state.user.user);
  const isAuthenticated = useIsAuthenticated();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
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
        <Link href={`/${locale}`}>
          <Logo />
        </Link>
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
