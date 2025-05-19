import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { electionService } from "@/services/electionService";
import { IElection } from "@/models/IElection";
import ElectionCard from "@/components/ElectionCard/ElectionCard";

interface PageProps {
  params: { locale: string };
}

export default async function Home({ params: { locale } }: PageProps) {
  const t = await getTranslations("home");
  const elections: IElection[] = await electionService.getAll();

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
