"use client";

import Link from "next/link";
import { HomeIcon } from "@/icons/HomeIcon";
import { VoteIcon } from "@/icons/VoteIcon";
import { InstructionsIcon } from "@/icons/InstructionsIcon";
import { ProfileIcon } from "@/icons/ProfileIcon";
import { SupportIcon } from "@/icons/SupportIcon";
import { AboutUsIcon } from "@/icons/AboutUsIcon";
import { LeftArrowIcon } from "@/icons/LeftArrowIcon";
import "./Sidebar.scss";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../Logo/Logo";
import { IIcon } from "@/models/IIcon";
import { useUIStore } from "@/store/uiStore";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/userSlice";

const Sidebar = () => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  if (!isAuthenticated) return null;

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());

    document.cookie =
      "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    router.push("/auth/login");
  };

  const path = usePathname();
  const defaultIcon: IIcon = {
    color: "#222831",
    strokeWidth: 2,
    size: 32,
  };
  const activeIcon: IIcon = {
    color: "#00adb5",
    strokeWidth: 4,
    size: 32,
  };
  const tabs = [
    { icon: HomeIcon, path: "/", title: "Главная", is_active: path === "/" },
    {
      icon: VoteIcon,
      path: "/vote",
      title: "Проголосовать",
      is_active: path === "/vote",
    },
    {
      icon: InstructionsIcon,
      path: "/instructions",
      title: "Инструкция",
      is_active: path === "/instructions",
    },
    {
      icon: ProfileIcon,
      path: "/profile",
      title: "Профиль",
      is_active: path === "/profile",
    },
    {
      icon: SupportIcon,
      path: "/support",
      title: "Тех. поддержка",
      is_active: path === "/support",
    },
    {
      icon: AboutUsIcon,
      path: "/about",
      title: "О нас",
      is_active: path === "/about",
    },
  ];
  return (
    <aside className="sidebar">
      <Logo />

      <div className="sidebar_wrapper">
        <ul>
          {tabs.map((tab, index) => (
            <li
              key={index}
              className={tab.is_active ? "active" : ""}
            >
              <Link href={tab.path}>
                <tab.icon {...(tab.is_active ? activeIcon : defaultIcon)} />
                <div>{tab.title}</div>
              </Link>
            </li>
          ))}
        </ul>
        <button
          className="logout"
          onClick={handleLogout}
        >
          <LeftArrowIcon {...defaultIcon} />
          <div>Выход</div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
