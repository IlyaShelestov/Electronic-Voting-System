"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/userSlice";
import Logo from "../Logo/Logo";
import "./Sidebar.scss";

import { HomeIcon } from "@/icons/HomeIcon";
import { VoteIcon } from "@/icons/VoteIcon";
import { InstructionsIcon } from "@/icons/InstructionsIcon";
import { ProfileIcon } from "@/icons/ProfileIcon";
import { SupportIcon } from "@/icons/SupportIcon";
import { AboutUsIcon } from "@/icons/AboutUsIcon";
import { LeftArrowIcon } from "@/icons/LeftArrowIcon";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const locale = useLocale();
  const t = useTranslations("sidebar");

  const handleLogout = async () => {
    try {
      dispatch(logout());
      router.push(`/${locale}/`);
    } catch (error) {
      console.error("Failed to logout cleanly:", error);
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
            console.log("isActive", isActive, pathname, fullPath);
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
