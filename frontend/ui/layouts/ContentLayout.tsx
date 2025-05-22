"use client";
import React from 'react';
import { useAppSelector } from '@/store/hooks';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import LoadingCircle from '@/components/LoadingCircle/LoadingCircle';

const ContentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const isLoading = useAppSelector((state) => state.loading['pageLoad']);

  return (
    <>
      <Sidebar />
      <div className={` ${isAuthenticated ? 'authenticated' : ''}`}>
        <Header />
        <main>
            {isLoading && <LoadingCircle />}
            {children}
        </main>
      </div>
    </>
  );
};

export default ContentLayout;