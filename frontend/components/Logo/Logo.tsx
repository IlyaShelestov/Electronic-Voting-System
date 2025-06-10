"use client";

import "./Logo.scss";

const Logo = () => {
  return (
    <div className="logo">
      <img
        src="/images/logo.png"
        alt="eVote"
        width={60}
        height={60}
      />
    </div>
  );
};

export default Logo;
