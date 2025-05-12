"use client";

import React from "react";

interface LanguageSwitcherProps {
  currentLocale: string;
  onChange: (locale: string) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  onChange,
}) => {
  const languages = [
    { code: "ru", label: "РУС" },
    { code: "kz", label: "ҚАЗ" },
    { code: "en", label: "ENG" },
  ];

  return (
    <div className="locales">
      {languages.map((lang, index) => (
        <React.Fragment key={lang.code}>
          <div
            className={`locale ${currentLocale === lang.code ? "active" : ""}`}
            onClick={() => onChange(lang.code)}
          >
            {lang.label}
          </div>
          {index < languages.length - 1 && " | "}
        </React.Fragment>
      ))}
    </div>
  );
};
