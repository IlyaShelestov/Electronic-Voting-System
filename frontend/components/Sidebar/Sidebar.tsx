"use client";

import "./Sidebar.scss";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { AboutUsIcon } from "@/icons/AboutUsIcon";
import { AdminIcon } from "@/icons/AdminIcon";
import { HomeIcon } from "@/icons/HomeIcon";
import { InstructionsIcon } from "@/icons/InstructionsIcon";
import { LeftArrowIcon } from "@/icons/LeftArrowIcon";
import { ManagerIcon } from "@/icons/ManagerIcon";
import { ProfileIcon } from "@/icons/ProfileIcon";
import { SupportIcon } from "@/icons/SupportIcon";
import { VoteIcon } from "@/icons/VoteIcon";
import { AuthService } from "@/services/authService";
import { useLoading } from "@/store/hooks/useLoading";

import LoadingButton from "../LoadingButton/LoadingButton";
import Logo from "../Logo/Logo";

export default function Sidebar() {
  const { user, isAuthenticated, logout: authLogout } = useAuth();
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const role = user?.role;
  const { isLoading, withLoading } = useLoading();

  const [isOpen, setIsOpen] = useState(true);
  const [loadingNavItem, setLoadingNavItem] = useState<string | null>(null);

  const handleLogout = async () => {
    await withLoading("logout", async () => {
      try {
        await authLogout(); // This now handles toast notifications
      } catch (error) {
        console.error("Failed to logout cleanly:", error);
      }
    });
  };

  const handleNavigation = async (path: string) => {
    setLoadingNavItem(path);
    setTimeout(() => {
      setLoadingNavItem(null);
    }, 300);
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
        className={`sidebar ${isOpen ? "open" : ""}`}
        aria-label="Sidebar Navigation"
      >
        <div className="sidebar-content">
          <Logo />

          <nav className="nav">
            <ul>
              {tabs.map(({ icon: Icon, path, title }, index) => {
                const fullPath = `${path}`;
                const isActive = pathname === fullPath;
                const isItemLoading = loadingNavItem === path;

                return (
                  <li
                    key={index}
                    className={`${isActive ? "active" : ""} ${
                      isItemLoading ? "loading" : ""
                    }`}
                  >
                    <Link
                      href={fullPath}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => handleNavigation(path)}
                    >
                      <div className="nav-item-content">
                        <Icon
                          {...(isActive
                            ? iconStyles.active
                            : iconStyles.default)}
                        />
                        <span>{title}</span>
                        {isItemLoading && (
                          <div className="nav-item-spinner"></div>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <LoadingButton
              className="logout"
              onClick={handleLogout}
              isLoading={isLoading("logout")}
              variant="danger"
              size="medium"
              loadingText={t("loggingOut")}
            >
              <LeftArrowIcon {...iconStyles.default} />
              <span>{t("logout")}</span>
            </LoadingButton>
          </nav>
        </div>
      </aside>
    </>
  );
}
