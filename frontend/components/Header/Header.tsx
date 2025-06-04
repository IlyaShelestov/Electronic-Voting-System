"use client";

import Logo from "../Logo/Logo";
import "./Header.scss";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useRouter, usePathname } from "next/navigation";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import { setUserLocale } from "@/utils/locale";
import { Locale } from "@/i18n/config";


const Header = () => {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: Locale) => {
    setUserLocale(newLocale);
  };

  return (
    <header className="header">
      <div className="header-content">

        {!user ? (
          <Link href={`/`}>
            <Logo />
          </Link>
        ) : (
          <Link
            href={`/profile`}
            className="user"
          >
            {user.first_name} {user.last_name}
          </Link>
        )}

        <LanguageSwitcher
          onChange={handleLocaleChange}
        />
      </div>
    </header>
  );
};

export default Header;
