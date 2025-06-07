"use client";

import './Home.scss';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import BannerSlider from '@/components/BannerSlider/BannerSlider';
import ElectionCard from '@/components/ElectionCard/ElectionCard';
import { IElection } from '@/models/IElection';
import { ElectionService } from '@/services/electionService';
import { useAppDispatch, useAppSelector, useIsAuthenticated } from '@/store/hooks';
import { setElections } from '@/store/slices/electionSlice';

type FilterOption = "all" | "available";

export default function Home() {
  const locale = useLocale();
  const t = useTranslations("homePage");
  const dispatch = useAppDispatch();
  const elections = useAppSelector((state) => state.election.elections);
  const isAuthenticated = useIsAuthenticated();
  const [filter, setFilter] = useState<FilterOption>("all");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const slides = [
    { src: "/images/default-banner.png", alt: t("bannerAlt") },
    { src: "/images/default-banner.png", alt: t("bannerAlt") },
  ];

  useEffect(() => {
    const fetchElections = async () => {
      let data: IElection[] | undefined;
      setErrorMessage(null);

      if (filter === "available" && !isAuthenticated) {
        setErrorMessage(t("authRequired"));
        dispatch(setElections([]));
        return;
      }

      if (filter === "all") {
        data = await ElectionService.getAll();
      } else if (filter === "available") {
        data = await ElectionService.getAvailable();
      }

      if (data) {
        dispatch(setElections(data));
      }
    };

    fetchElections();
  }, [filter, isAuthenticated]);

  return (
    <div className="home-container">
      <h1 className="home-title">{t("title")}</h1>

      <div className="banner">
        <BannerSlider slides={slides} />
      </div>

      <div className="filter-container">
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

      <h2>{t("currentElections")}</h2>

      <div
        className="elections-list"
        aria-live="polite"
      >
        {errorMessage ? (
          <div className="status-message error">{errorMessage}</div>
        ) : elections.length === 0 ? (
          <div className="status-message empty">
            {filter === "available"
              ? t("noAvailableElections")
              : t("noElections")}
          </div>
        ) : (
          elections.map((election) => (
            <ElectionCard
              key={election.election_id}
              election={election}
              locale={locale}
            />
          ))
        )}
      </div>
    </div>
  );
}
