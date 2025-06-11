"use client";
import "./Manager.scss";

import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  CandidatesManager,
  ElectionsManager,
  EventsManager,
  ManagerDashboard,
} from "@/components/Manager";

type TabType = "dashboard" | "elections" | "candidates" | "events";

export default function ManagerPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const t = useTranslations("managerPage");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <ManagerDashboard />;
      case "elections":
        return <ElectionsManager />;
      case "candidates":
        return <CandidatesManager />;
      case "events":
        return <EventsManager />;
      default:
        return <ManagerDashboard />;
    }
  };

  return (
    <div className="manager-page">
      <div className="manager-tabs">
        <button
          className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          {t("dashboard")}
        </button>
        <button
          className={`tab-button ${activeTab === "elections" ? "active" : ""}`}
          onClick={() => setActiveTab("elections")}
        >
          {t("elections")}
        </button>
        <button
          className={`tab-button ${activeTab === "candidates" ? "active" : ""}`}
          onClick={() => setActiveTab("candidates")}
        >
          {t("candidates")}
        </button>
        <button
          className={`tab-button ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          {t("events")}
        </button>
      </div>

      <div className="manager-content">{renderContent()}</div>
    </div>
  );
}
