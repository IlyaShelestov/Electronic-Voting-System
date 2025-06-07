import Image from "next/image";
import "./About.scss";
import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("aboutPage");
  const profiles = [
    {
      name: "Serimbetov Yersultan",
      group: "SE-2210",
      image: "/images/default-candidate.png",
      role: "Frontend Developer",
    },
    {
      name: "Shelestov Ilya",
      group: "SE-2207",
      image: "/images/default-candidate.png",
      role: "Backend Developer",
    },
    {
      name: "Yessentayev Rauan",
      group: "CS-2207",
      image: "/images/default-candidate.png",
      role: "Cybersecurity specialist",
    },
  ];
  return (
    <>
      <h1>{t("title")}</h1>
      <div className="about_us">
        {profiles.map((profile) => (
          <div
            className="profile"
            key={profile.name}
          >
            <Image
              src={profile.image}
              alt={profile.name}
              width={300}
              height={300}
            />
            <h2>{profile.name}</h2>
            <p>{profile.role}</p>
            <p>{profile.group}</p>
          </div>
        ))}
      </div>
    </>
  );
}
