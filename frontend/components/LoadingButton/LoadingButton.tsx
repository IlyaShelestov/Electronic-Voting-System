"use client";

import './LoadingButton.scss';

import React from 'react';

interface LoadingButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "small" | "medium" | "large";
  loadingText?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  onClick,
  isLoading = false,
  disabled = false,
  className = "",
  type = "button",
  variant = "primary",
  size = "medium",
  loadingText = "Loading...",
}) => {
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading || disabled) return;
    if (onClick) {
      await onClick(e);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={`loading-button loading-button--${variant} loading-button--${size} ${className} ${
        isLoading ? "loading-button--loading" : ""
      }`}
    >
      {isLoading ? (
        <div className="loading-button__content">
          <div className="loading-button__spinner"></div>
          <span className="loading-button__text">{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
