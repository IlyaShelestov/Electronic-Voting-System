import Link from "next/link";
import { HomeIcon } from "@/icons/HomeIcon";
import { VoteIcon } from "@/icons/VoteIcon";
import { InstructionsIcon } from "@/icons/InstructionsIcon";
import { ProfileIcon } from "@/icons/ProfileIcon";
import { SupportIcon } from "@/icons/SupportIcon";
import { AboutUsIcon } from "@/icons/AboutUsIcon";
import "./Sidebar.scss";
import { LeftArrowIcon } from "@/icons/LeftArrowIcon";

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar_wrapper">
        <ul>
          <li>
            <HomeIcon />
            <Link href="/">Главная</Link>
          </li>
          <li>
            <VoteIcon />
            <Link href="/vote">Проголосовать</Link>
          </li>
          <li>
            <InstructionsIcon />
            <Link href="/instructions">Инструкция</Link>
          </li>
          <li>
            <ProfileIcon />
            <Link href="/profile">Профиль</Link>
          </li>
          <li>
            <SupportIcon />
            <Link href="/support">Тех. поддержка</Link>
          </li>
          <li>
            <AboutUsIcon />
            <Link href="/about">О нас</Link>
          </li>
          <li>
            <LeftArrowIcon />
            <button className="logout">Выход</button>
          </li>
        </ul>
        <div></div>
      </div>
    </nav>
  );
};

export default Sidebar;
