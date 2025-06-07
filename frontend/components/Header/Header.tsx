"use client";

import './Header.scss';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Locale } from '@/i18n/config';
import { useAppSelector } from '@/store/hooks';
import { setUserLocale } from '@/utils/locale';

import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import Logo from '../Logo/Logo';

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
