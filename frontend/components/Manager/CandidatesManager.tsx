"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import LoadingCircle from '@/components/LoadingCircle/LoadingCircle';
import { ICandidate } from '@/models/ICandidate';
import { IElection } from '@/models/IElection';
import { IUser } from '@/models/IUser';
import { ManagerService } from '@/services/managerService';
import { UserService } from '@/services/userService';

import './CandidatesManager.scss';

const CandidatesManager = () => {
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [elections, setElections] = useState<IElection[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<ICandidate | null>(null);
  const [formData, setFormData] = useState({
    user_id: 0,
    election_id: 0,
    bio: '',
    party: '',
    avatar_url: '',
    additional_url_1: '',
    additional_url_2: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const t = useTranslations("managerPage");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidatesData, electionsData] = await Promise.all([
        ManagerService.getCandidates(),
        ManagerService.getElections(),
      ]);
      setCandidates(candidatesData);
      setElections(electionsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: 0,
      election_id: 0,
      bio: '',
      party: '',
      avatar_url: '',
      additional_url_1: '',
      additional_url_2: '',
    });
    setEditingCandidate(null);
  };

  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user_id || !formData.election_id || !formData.bio) {
      alert(t("fillRequiredFields"));
      return;
    }

    try {
      setSubmitting(true);      if (editingCandidate && editingCandidate.candidate_id) {
        await ManagerService.updateCandidate(editingCandidate.candidate_id, formData as ICandidate);
      } else {
        await ManagerService.createCandidate(formData as ICandidate);
      }
      setShowCreateForm(false);
      resetForm();
      await fetchData();
    } catch (error) {
      console.error('Failed to save candidate:', error);
      alert(editingCandidate ? t("updateCandidateError") : t("createCandidateError"));
    } finally {
      setSubmitting(false);
    }
  };
  const handleEditCandidate = (candidate: ICandidate) => {
    setEditingCandidate(candidate);
    setFormData({
      user_id: candidate.user_id || 0,
      election_id: candidate.election_id || 0,
      bio: candidate.bio || '',
      party: candidate.party || '',
      avatar_url: candidate.avatar_url || '',
      additional_url_1: candidate.additional_url_1 || '',
      additional_url_2: candidate.additional_url_2 || '',
    });
    setShowCreateForm(true);
  };

  const handleDeleteCandidate = async (candidateId: number) => {
    if (!confirm(t("confirmDeleteCandidate"))) {
      return;
    }

    try {
      await ManagerService.deleteCandidate(candidateId);
      await fetchData();
    } catch (error) {
      console.error('Failed to delete candidate:', error);
      alert(t("deleteCandidateError"));
    }
  };

  const handleAttachCandidate = async (electionId: number, candidateId: number) => {
    try {
      await ManagerService.attachCandidate(electionId, candidateId);
      await fetchData();
      alert(t("candidateAttachedSuccess"));
    } catch (error) {
      console.error('Failed to attach candidate:', error);
      alert(t("attachCandidateError"));
    }
  };

  if (loading) {
    return <LoadingCircle />;
  }

  return (
    <div className="candidates-manager">
      <div className="manager-header">
        <h2>{t("candidatesManagement")}</h2>
        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
        >
          {t("createCandidate")}
        </button>
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingCandidate ? t("editCandidate") : t("createNewCandidate")}</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateCandidate} className="candidate-form">
              <div className="form-group">
                <label>{t("user")} *</label>
                <input
                  type="number"
                  value={formData.user_id || ''}
                  onChange={(e) => setFormData({ ...formData, user_id: parseInt(e.target.value) || 0 })}
                  placeholder={t("enterUserId")}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("election")} *</label>
                <select
                  value={formData.election_id}
                  onChange={(e) => setFormData({ ...formData, election_id: parseInt(e.target.value) })}
                  required
                >
                  <option value={0}>{t("selectElection")}</option>
                  {elections.map((election) => (
                    <option key={election.election_id} value={election.election_id}>
                      {election.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t("bio")} *</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder={t("enterBio")}
                  rows={4}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("party")}</label>
                <input
                  type="text"
                  value={formData.party}
                  onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                  placeholder={t("enterParty")}
                />
              </div>
              <div className="form-group">
                <label>{t("avatarUrl")}</label>
                <input
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder={t("enterAvatarUrl")}
                />
              </div>
              <div className="form-group">
                <label>{t("additionalUrl1")}</label>
                <input
                  type="url"
                  value={formData.additional_url_1}
                  onChange={(e) => setFormData({ ...formData, additional_url_1: e.target.value })}
                  placeholder={t("enterAdditionalUrl")}
                />
              </div>
              <div className="form-group">
                <label>{t("additionalUrl2")}</label>
                <input
                  type="url"
                  value={formData.additional_url_2}
                  onChange={(e) => setFormData({ ...formData, additional_url_2: e.target.value })}
                  placeholder={t("enterAdditionalUrl")}
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (editingCandidate ? t("updating") : t("creating")) : (editingCandidate ? t("update") : t("create"))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="candidates-list">
        {candidates.length === 0 ? (
          <div className="no-candidates">
            <p>{t("noCandidatesFound")}</p>
            <button
              className="btn-primary"
              onClick={() => {
                resetForm();
                setShowCreateForm(true);
              }}
            >
              {t("createFirstCandidate")}
            </button>
          </div>
        ) : (
          <div className="candidates-grid">
            {candidates.map((candidate) => {
              const election = elections.find(e => e.election_id === candidate.election_id);
              return (
                <div key={candidate.candidate_id} className="candidate-card">
                  <div className="candidate-header">
                    {candidate.avatar_url && (
                      <img
                        src={candidate.avatar_url}
                        alt="Candidate Avatar"
                        className="candidate-avatar"
                      />
                    )}
                    <div className="candidate-info">
                      <h3>{t("candidateId")}: {candidate.candidate_id}</h3>
                      <p><strong>{t("userId")}:</strong> {candidate.user_id}</p>
                      {candidate.party && (
                        <p><strong>{t("party")}:</strong> {candidate.party}</p>
                      )}
                    </div>
                  </div>
                  <div className="candidate-details">
                    <p><strong>{t("election")}:</strong> {election?.title || t("unknown")}</p>
                    <p><strong>{t("bio")}:</strong></p>
                    <div className="bio-text">{candidate.bio}</div>
                    {candidate.additional_url_1 && (
                      <p><strong>{t("additionalUrl1")}:</strong> 
                        <a href={candidate.additional_url_1} target="_blank" rel="noopener noreferrer">
                          {candidate.additional_url_1}
                        </a>
                      </p>
                    )}
                    {candidate.additional_url_2 && (
                      <p><strong>{t("additionalUrl2")}:</strong> 
                        <a href={candidate.additional_url_2} target="_blank" rel="noopener noreferrer">
                          {candidate.additional_url_2}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="candidate-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => handleEditCandidate(candidate)}
                    >
                      {t("edit")}
                    </button>                    <button
                      className="btn-danger"
                      onClick={() => candidate.candidate_id && handleDeleteCandidate(candidate.candidate_id)}
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

export default CandidatesManager;
