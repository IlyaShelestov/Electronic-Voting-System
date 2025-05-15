"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import "./LanguageSwitcher.scss";

interface LanguageSwitcherProps {
  currentLocale: string;
  onChange: (locale: string) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const router = useRouter();
  const locale = useLocale();

  const languages = [
    { code: "ru", label: "РУС" },
    { code: "kz", label: "ҚАЗ" },
    { code: "en", label: "ENG" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === currentLocale) || languages[0];

  const handleSelect = (selectedLocale: string) => {
    onChange(selectedLocale);
    setIsOpen(false);
  };

  const handleLogin = () => {
    router.push(`/${locale}/auth/login`);
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
              onClick={() => handleSelect(code)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelect(code);
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
          Войти
        </button>
      )}
    </div>
  );
};
