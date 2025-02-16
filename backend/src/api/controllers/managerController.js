const Candidate = require("../../models/Candidate");
const Election = require("../../models/Election");
const Event = require("../../models/Event");

exports.createElection = async (req, res) => {
  try {
    const { title, start_date, end_date, region, city } = req.body;
    const election = await Election.create({
      title,
      start_date,
      end_date,
      region,
      city,
    });
    res.status(201).json(election);
  } catch (err) {
    res.status(500).json({ message: "Error creating election" });
  }
};

exports.deleteElection = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Election.delete(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: "Error deleting election" });
  }
};

exports.createCandidate = async (req, res) => {
  try {
    const {
      user_id,
      election_id,
      bio,
      party,
      avatar_url,
      additional_url_1,
      additional_url_2,
    } = req.body;
    const candidate = await Candidate.create({
      user_id,
      election_id,
      bio,
      party,
      avatar_url,
      additional_url_1,
      additional_url_2,
    });
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ message: "Error creating candidate" });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Candidate.delete(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: "Error deleting candidate" });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user_id,
      election_id,
      bio,
      party,
      avatar_url,
      additional_url_1,
      additional_url_2,
    } = req.body;
    const response = await Candidate.update(id, {
      user_id,
      election_id,
      bio,
      party,
      avatar_url,
      additional_url_1,
      additional_url_2,
    });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: "Error updating candidate" });
  }
};

exports.attachCandidate = async (req, res) => {
  try {
    const { election_id, candidate_id } = req.body;
    const response = await Candidate.attachToElection(
      candidate_id,
      election_id
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: "Error attaching candidate" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, event_date } = req.body;
    const event = await Event.create({ title, description, event_date });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error creating event" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, event_date } = req.body;
    const response = await Event.update(id, { title, description, event_date });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: "Error updating event" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Event.delete(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: "Error deleting event" });
  }
};
