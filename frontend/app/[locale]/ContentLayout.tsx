"use client";
import React from 'react';
import { useIsAuthenticated, useAppDispatch, usePageLoading } from '@/store/hooks';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import LoadingCircle from '@/components/LoadingCircle/LoadingCircle';
import Footer from '@/components/Footer/Footer';  
import Main from '@/components/Main/Main';

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
          {children}
        </Main>
        <Footer />
      </div>
    </>
  );
};