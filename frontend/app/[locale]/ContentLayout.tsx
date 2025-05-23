"use client";
import React from 'react';
import { useIsAuthenticated, useAppDispatch, usePageLoading } from '@/store/hooks';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import LoadingCircle from '@/components/LoadingCircle/LoadingCircle';


export default function ContentLayout({ children }: { children: React.ReactNode }) {
    
  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = usePageLoading();

  return (
    <div className="content-layout">   
      {isAuthenticated && <Sidebar />}
      <div className={`${isAuthenticated ? 'authenticated' : ''}`}>
        <Header />
        <main>
          {isLoading && <LoadingCircle />}
          {children}
        </main>
      </div>
    </div>
  );
};