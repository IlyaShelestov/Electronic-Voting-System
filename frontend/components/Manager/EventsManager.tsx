"use client";

import "./EventsManager.scss";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import LoadingCircle from "@/components/LoadingCircle/LoadingCircle";
import { IEvent } from "@/models/IEvent";
import { ManagerService } from "@/services/managerService";

const EventsManager = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const t = useTranslations("managerPage");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const eventsData = await ManagerService.getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_date: "",
    });
    setEditingEvent(null);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.event_date) {
      alert(t("fillRequiredFields"));
      return;
    }

    try {
      setSubmitting(true);
      if (editingEvent && editingEvent.event_id) {
        await ManagerService.updateEvent(
          editingEvent.event_id,
          formData as IEvent
        );
      } else {
        await ManagerService.createEvent(formData as IEvent);
      }
      setShowCreateForm(false);
      resetForm();
      await fetchData();
    } catch (error) {
      console.error("Failed to save event:", error);
      alert(editingEvent ? t("updateEventError") : t("createEventError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEvent = (event: IEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date.split("T")[0], // Convert to YYYY-MM-DD format
    });
    setShowCreateForm(true);
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm(t("confirmDeleteEvent"))) {
      return;
    }

    try {
      await ManagerService.deleteEvent(eventId);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert(t("deleteEventError"));
    }
  };

  const getEventStatus = (eventDate: string) => {
    const now = new Date();
    const event = new Date(eventDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(
      event.getFullYear(),
      event.getMonth(),
      event.getDate()
    );

    if (eventDay > today) return { status: "upcoming", label: t("upcoming") };
    if (eventDay.getTime() === today.getTime())
      return { status: "today", label: t("today") };
    return { status: "past", label: t("past") };
  };

  if (loading) {
    return <LoadingCircle />;
  }

  return (
    <div className="events-manager">
      <div className="manager-header">
        <h2>{t("eventsManagement")}</h2>
        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
        >
          {t("createEvent")}
        </button>
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingEvent ? t("editEvent") : t("createNewEvent")}</h3>
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
            <form
              onSubmit={handleCreateEvent}
              className="event-form"
            >
              <div className="form-group">
                <label>{t("eventTitle")} *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder={t("enterEventTitle")}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("eventDescription")} *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t("enterEventDescription")}
                  rows={4}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("eventDate")} *</label>
                <input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) =>
                    setFormData({ ...formData, event_date: e.target.value })
                  }
                  required
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
                  {submitting
                    ? editingEvent
                      ? t("updating")
                      : t("creating")
                    : editingEvent
                    ? t("update")
                    : t("create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="events-list">
        {events.length === 0 ? (
          <div className="no-events">
            <p>{t("noEventsFound")}</p>
            <button
              className="btn-primary"
              onClick={() => {
                resetForm();
                setShowCreateForm(true);
              }}
            >
              {t("createFirstEvent")}
            </button>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => {
              const status = getEventStatus(event.event_date);
              return (
                <div
                  key={event.event_id}
                  className="event-card"
                >
                  <div className="event-header">
                    <h3>{event.title}</h3>
                    <span className={`status ${status.status}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="event-details">
                    <div className="event-date">
                      <strong>{t("eventDate")}:</strong>{" "}
                      {new Date(event.event_date).toLocaleDateString()}
                    </div>
                    <div className="event-description">
                      <strong>{t("description")}:</strong>
                      <p>{event.description}</p>
                    </div>
                  </div>
                  <div className="event-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => handleEditEvent(event)}
                    >
                      {t("edit")}
                    </button>{" "}
                    <button
                      className="btn-danger"
                      onClick={() =>
                        event.event_id && handleDeleteEvent(event.event_id)
                      }
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

export default EventsManager;
