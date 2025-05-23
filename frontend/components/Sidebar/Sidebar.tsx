"use client";

import { AboutUsIcon } from "@/icons/AboutUsIcon";
import { HomeIcon } from "@/icons/HomeIcon";
import { InstructionsIcon } from "@/icons/InstructionsIcon";
import { LeftArrowIcon } from "@/icons/LeftArrowIcon";
import { ProfileIcon } from "@/icons/ProfileIcon";
import { SupportIcon } from "@/icons/SupportIcon";
import { VoteIcon } from "@/icons/VoteIcon";
import { authService } from "@/services/authService";
import { useAppAuthenticated, useAppDispatch, useAppLoading, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/userSlice";  
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Logo from "../Logo/Logo";
import { AdminIcon } from "@/icons/AdminIcon";
import { ManagerIcon } from "@/icons/ManagerIcon";
import "./Sidebar.scss";

const Sidebar = ( ) => {

  const isAuthenticated = useAppAuthenticated();
  const isLoading = useAppLoading();
  if (!isAuthenticated) {
    return null;
  }

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const locale = useLocale();
  const t = useTranslations("sidebar");
  const role = useAppSelector((state) => state.user.user?.role);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      router.push(`/${locale}/`);
    } catch (error) {
      console.error("Failed to logout cleanly:", error);
      dispatch(logout());
      router.push(`/${locale}/`);
    }
  };

  const iconStyles = {
    default: { color: "#222831", strokeWidth: 2, size: 32 },
    active: { color: "#00adb5", strokeWidth: 4, size: 32 },
  };

  const tabs = [
    { icon: HomeIcon, path: "", title: t("home") },
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

  return (
    <aside
      className={`sidebar ${!isAuthenticated ? "hidden" : "open"}`}
      aria-label="Sidebar Navigation"
    >
      <Logo />
      <nav className="sidebar_wrapper">
        <ul>
          {tabs.map(({ icon: Icon, path, title }, index) => {
            const fullPath = `/${locale}${path}`;
            const isActive = pathname === fullPath;
            return (
              <li
                key={index}
                className={isActive ? "active" : ""}
              >
                <Link
                  href={fullPath}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    {...(isActive ? iconStyles.active : iconStyles.default)}
                  />
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
    </aside>
  );
};

export default Sidebar;