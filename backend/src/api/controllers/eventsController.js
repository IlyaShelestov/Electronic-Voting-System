const Event = require("../../models/Event");

exports.getAll = async (req, res) => {
  try {
    const events = await Event.getAll();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Error getting events" });
  }
};
