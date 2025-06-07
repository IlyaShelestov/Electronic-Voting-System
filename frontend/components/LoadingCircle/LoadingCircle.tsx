"use client";
import './LoadingCircle.scss';

import React from 'react';

const  LoadingCircle: React.FC = () => {
  return (
    <div className="loading-circle">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingCircle; 