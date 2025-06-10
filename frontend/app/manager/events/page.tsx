"use client";
import "./Events.scss";

import { useEffect, useState } from "react";

import { IEvent } from "@/models/IEvent";
import { ManagerService } from "@/services/managerService";

export default function EventsPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<IEvent, "event_id">>({
    title: "",
    description: "",
    event_date: "",
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await ManagerService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ManagerService.createEvent(newEvent as IEvent);
      setShowForm(false);
      setNewEvent({ title: "", description: "", event_date: "" });
      fetchEvents(); // Refresh list
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading events...</div>;
  }

  return (
    <div className="manager-resource-page">
      <h1>Events</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="manager-button"
      >
        {showForm ? "Cancel" : "Add New Event"}
      </button>
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="manager-form"
        >
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="event_date">Event Date:</label>
            <input
              type="date"
              id="event_date"
              name="event_date"
              value={newEvent.event_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="manager-button submit-button"
          >
            Create Event
          </button>
        </form>
      )}
      <ul className="manager-list">
        {events.map((event) => (
          <li
            key={event.event_id}
            className="manager-list-item"
          >
            {event.title} - {new Date(event.event_date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
