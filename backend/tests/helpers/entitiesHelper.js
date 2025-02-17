const Event = require("../../src/models/Event");

const createEvent = async (overrides = {}) => {
  try {
    const data = {
      title: "TestTitle",
      description: "TestDescription",
      event_date: "2021-01-01",
      ...overrides,
    };
    const event = await Event.create(data);
    return event;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

module.exports = {
  createEvent,
};
