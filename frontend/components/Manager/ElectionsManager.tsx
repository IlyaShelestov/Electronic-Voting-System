"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import LoadingCircle from '@/components/LoadingCircle/LoadingCircle';
import { ICity } from '@/models/ICity';
import { IElection } from '@/models/IElection';
import { IRegion } from '@/models/IRegion';
import { LocationsService } from '@/services/locationsService';
import { ManagerService } from '@/services/managerService';

import './ElectionsManager.scss';

const ElectionsManager = () => {
  const [elections, setElections] = useState<IElection[]>([]);
  const [regions, setRegions] = useState<IRegion[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    start_date: '',
    end_date: '',
    region_id: 0,
    city_id: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const t = useTranslations("managerPage");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [electionsData, regionsData, citiesData] = await Promise.all([
        ManagerService.getElections(),
        LocationsService.getRegions(),
        LocationsService.getCities(),
      ]);
      setElections(electionsData);
      setRegions(regionsData);
      setCities(citiesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.start_date || !formData.end_date) {
      alert(t("fillRequiredFields"));
      return;
    }

    try {
      setSubmitting(true);
      await ManagerService.createElection(formData as IElection);
      setShowCreateForm(false);
      setFormData({
        title: '',
        start_date: '',
        end_date: '',
        region_id: 0,
        city_id: 0,
      });
      await fetchData();
    } catch (error) {
      console.error('Failed to create election:', error);
      alert(t("createElectionError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteElection = async (electionId: number) => {
    if (!confirm(t("confirmDeleteElection"))) {
      return;
    }

    try {
      await ManagerService.deleteElection(electionId);
      await fetchData();
    } catch (error) {
      console.error('Failed to delete election:', error);
      alert(t("deleteElectionError"));
    }
  };

  const getElectionStatus = (election: IElection) => {
    const now = new Date().toISOString().split('T')[0];
    const startDate = election.start_date;
    const endDate = election.end_date;

    if (now < startDate) return { status: 'upcoming', label: t("upcoming") };
    if (now >= startDate && now <= endDate) return { status: 'active', label: t("active") };
    return { status: 'completed', label: t("completed") };
  };

  const filteredCities = cities.filter(city => 
    formData.region_id === 0 || city.region_id === formData.region_id
  );

  if (loading) {
    return <LoadingCircle />;
  }

  return (
    <div className="elections-manager">
      <div className="manager-header">
        <h2>{t("electionsManagement")}</h2>
        <button
          className="btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          {t("createElection")}
        </button>
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{t("createNewElection")}</h3>
              <button
                className="close-btn"
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateElection} className="election-form">
              <div className="form-group">
                <label>{t("electionTitle")}</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("startDate")}</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("endDate")}</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("region")}</label>
                <select
                  value={formData.region_id}
                  onChange={(e) => setFormData({ ...formData, region_id: parseInt(e.target.value), city_id: 0 })}
                >
                  <option value={0}>{t("selectRegion")}</option>
                  {regions.map((region) => (
                    <option key={region.region_id} value={region.region_id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t("city")}</label>
                <select
                  value={formData.city_id}
                  onChange={(e) => setFormData({ ...formData, city_id: parseInt(e.target.value) })}
                >
                  <option value={0}>{t("selectCity")}</option>
                  {filteredCities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? t("creating") : t("create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="elections-list">
        {elections.length === 0 ? (
          <div className="no-elections">
            <p>{t("noElectionsFound")}</p>
            <button
              className="btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              {t("createFirstElection")}
            </button>
          </div>
        ) : (
          <div className="elections-grid">
            {elections.map((election) => {
              const status = getElectionStatus(election);
              return (
                <div key={election.election_id} className="election-card">
                  <div className="election-header">
                    <h3>{election.title}</h3>
                    <span className={`status ${status.status}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="election-details">
                    <p><strong>{t("startDate")}:</strong> {new Date(election.start_date).toLocaleDateString()}</p>
                    <p><strong>{t("endDate")}:</strong> {new Date(election.end_date).toLocaleDateString()}</p>
                    {election.region_id && (
                      <p><strong>{t("region")}:</strong> {regions.find(r => r.region_id === election.region_id)?.name}</p>
                    )}
                    {election.city_id && (
                      <p><strong>{t("city")}:</strong> {cities.find(c => c.city_id === election.city_id)?.name}</p>
                    )}
                  </div>
                  <div className="election-actions">                    <button
                      className="btn-danger"
                      onClick={() => election.election_id && handleDeleteElection(election.election_id)}
                    >
                      {t("delete")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionsManager;
