"use client";
import React from 'react';
import { useAppAuthenticated, useAppLoading } from '@/store/hooks';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import LoadingCircle from '@/components/LoadingCircle/LoadingCircle';
import AuthChecker from '@/app/[locale]/auth/AuthChecker';

const ContentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
  const isAuthenticated = useAppAuthenticated();
  const isLoading = useAppLoading();

  return (
    <>  

      <Sidebar />
      <div className={`${isAuthenticated ? 'authenticated' : ''}`}>
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