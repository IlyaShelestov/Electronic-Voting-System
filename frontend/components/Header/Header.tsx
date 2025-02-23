"use client";

import Logo from "../Logo/Logo";
import "./Header.scss";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";

const Header = () => {
  const user = useAppSelector((state) => state.user.user);

  return (
    <header>
      {!user ? (
        <Logo />
      ) : (
        <Link
          href="/profile"
          className="user"
        >
          {user.first_name} {user.last_name}
        </Link>
      )}
      <div className="locales">
        <div className="locale active">РУС</div>|
        <div className="locale">ҚАЗ</div>|<div className="locale">ENG</div>
      </div>
    </header>
  );
};

export default Header;
