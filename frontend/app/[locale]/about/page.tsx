import Image from "next/image";
import "./About.scss";
export default function About() {
  const profiles = [
    {
      name: "Антон Птушкин",
      image: "/images/ornament.png",
      role: "Frontend Developer",
    },
    {
      name: "Андрей Шевченко",
      image: "/images/ornament.png",
      role: "Backend Developer",
    },
    {
      name: "Генадий Головкин",
      image: "/images/ornament.png",
      role: "Cybersecurity specialist",
    },
  ];
  return (
    <>
      <h1>О нас</h1>
      <div className="about_us">
        {profiles.map((profile) => (
          <div
            className="profile"
            key={profile.name}
          >
            <Image
              src={profile.image}
              alt={profile.name}
              width={275}
              height={275}
            />
            <h2>{profile.name}</h2>
            <p>{profile.role}</p>
          </div>
        ))}
      </div>
    </>
  );
}
