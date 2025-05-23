"use client";
import React from 'react';
import { useIsAuthenticated, useAppDispatch } from '@/store/hooks';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import LoadingCircle from '@/components/LoadingCircle/LoadingCircle';
import { setLoading } from '@/store/slices/loadingSlice';

export default function ContentLayout({ children }: { children: React.ReactNode }) {
    
  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = dispatch(setLoading({ key: "page", value: true }));

  return (
    <div className="content-layout">   
      {isAuthenticated && <Sidebar />}
      <div className={`${isAuthenticated ? 'authenticated' : ''}`}>
        <Header />
        <main>
          {isLoading && <LoadingCircle />}
          {!isLoading && children}
        </main>
      </div>
    </div>
  );
};