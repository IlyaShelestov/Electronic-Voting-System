"use client";
import React from 'react';

import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import LoadingCircle from '@/components/LoadingCircle/LoadingCircle';
import Main from '@/components/Main/Main';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useAppDispatch, useIsAuthenticated, usePageLoading } from '@/store/hooks';

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = usePageLoading();

  return (
    <>
      {isAuthenticated && <Sidebar />}
      <div className={`content ${isAuthenticated ? 'authenticated' : ''}`}>
        <Header />
        <Main>
          {isLoading && <LoadingCircle />}
          {!isLoading && children}  
        </Main>
        <Footer />
      </div>
    </>
  );
};