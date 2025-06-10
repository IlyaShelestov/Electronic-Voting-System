"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import LoadingCircle from '@/components/LoadingCircle/LoadingCircle';
import { ICandidate } from '@/models/ICandidate';
import { IElection } from '@/models/IElection';
import { IEvent } from '@/models/IEvent';
import { ManagerService } from '@/services/managerService';

import './ManagerDashboard.scss';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalElections: 0,
    activeElections: 0,
    totalCandidates: 0,
    totalEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentElections, setRecentElections] = useState<IElection[]>([]);
  const [recentEvents, setRecentEvents] = useState<IEvent[]>([]);
  const t = useTranslations("managerPage");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [elections, candidates, events] = await Promise.all([
          ManagerService.getElections(),
          ManagerService.getCandidates(),
          ManagerService.getEvents(),
        ]);

        const now = new Date().toISOString().split('T')[0];
        const activeElections = elections.filter(
          (election: IElection) => 
            election.start_date <= now && election.end_date >= now
        );

        setStats({
          totalElections: elections.length,
          activeElections: activeElections.length,
          totalCandidates: candidates.length,
          totalEvents: events.length,
        });

        // Get recent elections (last 5)
        setRecentElections(elections.slice(0, 5));
        
        // Get recent events (last 5)
        setRecentEvents(events.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingCircle />;
  }

  return (
    <div className="manager-dashboard">
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalElections}</div>
          <div className="stat-label">{t("totalElections")}</div>
        </div>
        <div className="stat-card active">
          <div className="stat-number">{stats.activeElections}</div>
          <div className="stat-label">{t("activeElections")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalCandidates}</div>
          <div className="stat-label">{t("totalCandidates")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalEvents}</div>
          <div className="stat-label">{t("totalEvents")}</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h3>{t("recentElections")}</h3>
          <div className="recent-items">
            {recentElections.length > 0 ? (
              recentElections.map((election) => (
                <div key={election.election_id} className="recent-item">
                  <div className="item-title">{election.title}</div>
                  <div className="item-date">
                    {new Date(election.start_date).toLocaleDateString()} - {new Date(election.end_date).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-items">{t("noElections")}</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h3>{t("recentEvents")}</h3>
          <div className="recent-items">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div key={event.event_id} className="recent-item">
                  <div className="item-title">{event.title}</div>
                  <div className="item-date">
                    {new Date(event.event_date).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-items">{t("noEvents")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
