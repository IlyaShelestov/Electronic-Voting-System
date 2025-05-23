"use client";
import React from 'react';
import './LoadingCircle.scss';

const  LoadingCircle: React.FC = () => {
  return (
    <div className="loading-circle">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingCircle; 