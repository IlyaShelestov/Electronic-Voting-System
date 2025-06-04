"use client";
import Image from "next/image";
import { ElectionService } from "@/services/electionService";
import ElectionCard from "@/components/ElectionCard/ElectionCard";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { setElections } from "@/store/slices/electionSlice";
import "./Home.scss";

export default function Home() {
  const locale = useLocale();
  const t = useTranslations("homePage");
  const dispatch = useAppDispatch();
  const elections = useAppSelector((state) => state.election.elections);

  useEffect(() => {
    const fetchElections = async () => {
      const elections = await ElectionService.getAll();
      console.log(elections)
      dispatch(setElections(elections));
    };
    fetchElections();
  }, []);


  return (
    <div className="home-container">
      <h1 className="home-title">{t("title")}</h1>

      <div className="banner">
        <Image
          src="/images/default-banner.png"
          alt={t("bannerAlt")}
          width={1200}
          height={300}
          className="banner-image"
        />
      </div>

      <h2>{t("currentElections")}</h2>

      <div className="elections-list">
        {elections.map((election) => (
          <ElectionCard
            key={election.election_id}
            election={election}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
