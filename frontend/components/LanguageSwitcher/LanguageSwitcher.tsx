"use client";

import './LanguageSwitcher.scss';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Locale } from '@/i18n/config';
import { useIsAuthenticated } from '@/store/hooks';

interface LanguageSwitcherProps {
  onChange: (locale: Locale) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();
  const t = useTranslations("auth");
  const currentLocale = useLocale();

  const languages = [
    { code: "ru", label: "РУС" },
    { code: "kz", label: "ҚАЗ" },
    { code: "en", label: "ENG" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === currentLocale) || languages[0];

  const handleSelect = (selectedLocale: Locale) => {
    onChange(selectedLocale);
    setIsOpen(false);
  };

  const handleLogin = () => {
    router.push(`/auth/login`);
  };

  return (
    <div className="language-switcher">
      <button
        className="current-language"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {currentLanguage.label} ▼
      </button>

      {isOpen && (
        <ul
          className="language-options"
          role="listbox"
        >
          {languages.map(({ code, label }) => (
            <li
              key={code}
              className={`language-option ${
                currentLocale === code ? "active" : ""
              }`}
              role="option"
              aria-selected={currentLocale === code}
              onClick={() => handleSelect(code as Locale)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelect(code as Locale);
                }
              }}
            >
              {label}
            </li>
          ))}
        </ul>
      )}

      {!isAuthenticated && (
        <button
          className="login-button"
          onClick={handleLogin}
        >
          {t("login")}
        </button>
      )}
    </div>
  );
};
