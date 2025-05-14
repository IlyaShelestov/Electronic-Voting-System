"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { electionService } from "@/services/electionService";
import { setElections } from "@/store/slices/electionSlice";
import { IElection } from "@/models/IElection";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import "./Home.scss";
import { RightArrowCircle } from "@/icons/RightArrowCircle";

export default function Home() {
  const dispatch = useAppDispatch();
  const elections: IElection[] = useAppSelector(
    (state) => state.election.elections
  );
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("home");

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const data = await electionService.getAll();
        dispatch(setElections(data));
      } catch (error) {
        console.error("Error loading elections", error);
      }
    };

    fetchElections();
  }, [dispatch]);

  const locale = useLocale();

  const handleElectionClick = (electionId: number) => {
    router.push(`/${locale}/elections/${electionId}/candidates`);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">{t("title")}</h1>

      <div className="banner">
        <Image
          src="/images/election-banner.png"
          alt={t("bannerAlt")}
          width={800}
          height={300}
          className="banner-image"
        />
      </div>

      <h2>{t("currentElections")}</h2>

      <div className="elections-list">
        {elections.map((election) => (
          <div
            key={election.election_id}
            className="election-card"
            onClick={() => handleElectionClick(election.election_id)}
          >
            <span>{election.title}</span>
            <button
              className="arrow-btn"
              aria-label={t("viewCandidates")}
            >
              <RightArrowCircle
                color="black"
                strokeWidth={4}
                size={32}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
