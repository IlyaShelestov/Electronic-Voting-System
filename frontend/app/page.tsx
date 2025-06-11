"use client";

import "./Home.scss";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import BannerSlider from "@/components/BannerSlider/BannerSlider";
import ElectionCard from "@/components/ElectionCard/ElectionCard";
import EventCard from "@/components/EventCard/EventCard";
import { IElection } from "@/models/IElection";
import { IEvent } from "@/models/IEvent";
import { ElectionService } from "@/services/electionService";
import { EventService } from "@/services/eventService";
import { useAppDispatch, useIsAuthenticated } from "@/store/hooks";
import { setElections } from "@/store/slices/electionSlice";

type SortOption =
  | "byNameAsc"
  | "byNameDesc"
  | "byDateAsc"
  | "byDateDesc"
  | "byVotesAsc"
  | "byVotesDesc";
type FilterOption = "all" | "available";

export default function Home() {
  const t = useTranslations("homePage");
  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<SortOption>("byDateAsc");
  const [filter, setFilter] = useState<FilterOption>("all");

  const slides = [
    { src: "/images/default-banner.png", alt: t("bannerAlt") },
    { src: "/images/default-banner.png", alt: t("bannerAlt") },
    { src: "/images/default-banner.png", alt: t("bannerAlt") },
    { src: "/images/default-banner.png", alt: t("bannerAlt") },
    { src: "/images/default-banner.png", alt: t("bannerAlt") },
    { src: "/images/default-banner.png", alt: t("bannerAlt") },
    { src: "/images/default-banner.png", alt: t("bannerAlt") },
    { src: "/images/default-banner.png", alt: t("bannerAlt") },
    { src: "/images/default-banner.png", alt: t("bannerAlt") },
  ];
  const [availableElections, setAvailableElections] = useState<IElection[]>([]);
  const [allElections, setAllElections] = useState<IElection[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);
  useEffect(() => {
    const fetchElections = async () => {
      setErrorMessage(null);

      try {
        const availableData = isAuthenticated
          ? await ElectionService.getAvailable()
          : [];
        const allData = await ElectionService.getAll();
        console.log("All Elections:", allData);

        if (sort === "byDateAsc") {
          availableData.sort(
            (a, b) =>
              new Date(a.start_date).getTime() -
              new Date(b.start_date).getTime()
          );
          allData.sort(
            (a, b) =>
              new Date(a.start_date).getTime() -
              new Date(b.start_date).getTime()
          );
        } else if (sort === "byDateDesc") {
          availableData.sort(
            (a, b) =>
              new Date(b.start_date).getTime() -
              new Date(a.start_date).getTime()
          );
          allData.sort(
            (a, b) =>
              new Date(b.start_date).getTime() -
              new Date(a.start_date).getTime()
          );
        } else if (sort === "byNameAsc") {
          availableData.sort((a, b) => a.title.localeCompare(b.title));
          allData.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === "byNameDesc") {
          availableData.sort((a, b) => b.title.localeCompare(a.title));
          allData.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sort === "byVotesAsc") {
          availableData.sort(
            (a, b) => (a.report?.length ?? 0) - (b.report?.length ?? 0)
          );
          allData.sort(
            (a, b) => (a.report?.length ?? 0) - (b.report?.length ?? 0)
          );
        } else if (sort === "byVotesDesc") {
          availableData.sort(
            (a, b) => (b.report?.length ?? 0) - (a.report?.length ?? 0)
          );
          allData.sort(
            (a, b) => (b.report?.length ?? 0) - (a.report?.length ?? 0)
          );
        }

        setAvailableElections(availableData);
        setAllElections(allData);
        dispatch(setElections(allData));
      } catch (error) {
        setErrorMessage(t("fetchError"));
      }
    };

    const fetchUpcomingEvents = async () => {
      try {
        const events = await EventService.getUpcoming();
        setUpcomingEvents(events.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch upcoming events:", error);
      }
    };

    fetchElections();
    fetchUpcomingEvents();
  }, [sort, isAuthenticated]);

  const filteredElections =
    filter === "available"
      ? availableElections.filter((election) =>
          election.title.toLowerCase().includes(search.toLowerCase())
        )
      : allElections.filter((election) =>
          election.title.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <div className="home-container">
      <h1 className="home-title">{t("title")}</h1>{" "}
      <BannerSlider slides={slides} />
      {/* Upcoming Events Section */}
      <section className="upcoming-events-section">
        <h2 className="section-title">{t("upcomingEvents")}</h2>
        {upcomingEvents.length > 0 ? (
          <div className="events-grid">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.event_id}
                event={event}
              />
            ))}
          </div>
        ) : (
          <div className="no-events-message">{t("noUpcomingEvents")}</div>
        )}
      </section>
      <div className="filter-container">
        <input
          id="election-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
        />
        <div>
          <div>
            <label htmlFor="election-filter">{t("filterBy")}:</label>
            <select
              id="election-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterOption)}
            >
              <option value="all">{t("allElections")}</option>
              <option value="available">{t("availableElections")}</option>
            </select>
          </div>
          <div>
            <label htmlFor="election-sort">{t("sortBy")}</label>
            <select
              id="election-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
            >
              <option value="byNameAsc">{t("byName")} ↑</option>
              <option value="byNameDesc">{t("byName")} ↓</option>
              <option value="byDateAsc">{t("byDate")} ↑</option>
              <option value="byDateDesc">{t("byDate")} ↓</option>
              <option value="byVotesAsc">{t("byVotes")} ↑</option>
              <option value="byVotesDesc">{t("byVotes")} ↓</option>
            </select>
          </div>
        </div>
      </div>
      <div
        className="elections-list"
        aria-live="polite"
      >
        {filteredElections.length === 0 ? (
          availableElections.length === 0 && filter === "available" ? (
            <div className="status-message empty">
              {t("noAvailableElections")}
            </div>
          ) : (
            <div className="status-message empty">{t("noElections")}</div>
          )
        ) : (
          <>
            {filteredElections.map((election) => (
              <ElectionCard
                key={election.election_id}
                election={election}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
