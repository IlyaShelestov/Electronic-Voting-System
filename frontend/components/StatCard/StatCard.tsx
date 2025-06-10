import "./StatCard.scss";

import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  variant?: "primary" | "success" | "warning" | "danger" | "info";
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  variant = "primary",
  onClick,
}) => {
  return (
    <div
      className={`stat-card stat-card--${variant} ${
        onClick ? "stat-card--clickable" : ""
      }`}
      onClick={onClick}
    >
      <div className="stat-card__content">
        <h3 className="stat-card__value">{value}</h3>
        <p className="stat-card__title">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
