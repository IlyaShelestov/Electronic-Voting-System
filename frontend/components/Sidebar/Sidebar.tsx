"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HomeIcon } from "@/icons/HomeIcon";
import { VoteIcon } from "@/icons/VoteIcon";
import { InstructionsIcon } from "@/icons/InstructionsIcon";
import { ProfileIcon } from "@/icons/ProfileIcon";
import { SupportIcon } from "@/icons/SupportIcon";
import { AboutUsIcon } from "@/icons/AboutUsIcon";
import { LeftArrowIcon } from "@/icons/LeftArrowIcon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/userSlice";
import { useEffect } from "react";
import Logo from "../Logo/Logo";
import "./Sidebar.scss";
import {removeAuthToken} from "@/utils/tokenHelper";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const path = usePathname();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    console.log("Sidebar Rendered. Authenticated:", isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    removeAuthToken();
    router.push("/auth/login");
  };

  const defaultIcon = { color: "#222831", strokeWidth: 2, size: 32 };
  const activeIcon = { color: "#00adb5", strokeWidth: 4, size: 32 };

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
    <aside className={`sidebar ${!isAuthenticated ? "hidden" : "open"}`}>
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
