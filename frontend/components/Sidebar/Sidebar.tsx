"use client";

import { useState } from "react";
import { AboutUsIcon } from "@/icons/AboutUsIcon";
import { HomeIcon } from "@/icons/HomeIcon";
import { InstructionsIcon } from "@/icons/InstructionsIcon";
import { LeftArrowIcon } from "@/icons/LeftArrowIcon";
import { ProfileIcon } from "@/icons/ProfileIcon";
import { SupportIcon } from "@/icons/SupportIcon";
import { VoteIcon } from "@/icons/VoteIcon";
import { AdminIcon } from "@/icons/AdminIcon";
import { ManagerIcon } from "@/icons/ManagerIcon";
import { AuthService } from "@/services/authService";
import { useIsAuthenticated, useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/userSlice";  
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../Logo/Logo";

import "./Sidebar.scss";

export default function Sidebar() {
  const isAuthenticated = useIsAuthenticated();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const role = useAppSelector((state) => state.user.user?.role);

  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Failed to logout cleanly:", error);
    } finally {
      dispatch(logout());
      router.push(`/`);
    }
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const iconStyles = {
    default: { color: "#222831", strokeWidth: 2, size: 32 },
    active: { color: "#00adb5", strokeWidth: 4, size: 32 },
  };

  const tabs = [
    { icon: HomeIcon, path: "/", title: t("home") },
    { icon: VoteIcon, path: "/vote", title: t("vote") },
    { icon: InstructionsIcon, path: "/instructions", title: t("instructions") },
    { icon: ProfileIcon, path: "/profile", title: t("profile") },
    { icon: SupportIcon, path: "/support", title: t("support") },
    { icon: AboutUsIcon, path: "/about", title: t("about") },
  ];

  if (role === "admin") {
    tabs.push({ icon: AdminIcon, path: "/admin", title: t("admin") });
  }
  if (role === "manager") {
    tabs.push({ icon: ManagerIcon, path: "/manager", title: t("manager") });
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <aside
        className={`sidebar ${isOpen ? "open" : "hidden"}`}
        aria-label="Sidebar Navigation"
      >
        <div className="sidebar-content">
          <Logo />

          <nav className="nav">
            <ul>
              {tabs.map(({ icon: Icon, path, title }, index) => {
                const fullPath = `${path}`;
                const isActive = pathname === fullPath;
                return (
                  <li key={index} className={isActive ? "active" : ""}>
                    <Link href={fullPath} aria-current={isActive ? "page" : undefined}>
                      <Icon {...(isActive ? iconStyles.active : iconStyles.default)} />
                      <span>{title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <button
              className="logout"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LeftArrowIcon {...iconStyles.default} />
              <span>{t("logout")}</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}
