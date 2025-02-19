import Image from "next/image";
import Logo from "../Logo/Logo";
import "./Header.scss";
import Link from "next/link";

const Header = () => {
  let user = {
    firstName: "John",
    lastName: "Doe",
  };
  return (
    <header>
      {!user && <Logo />}
      {user && (
        <Link
          href="/profile"
          className="user"
        >
          {user.firstName} {user.lastName}
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
