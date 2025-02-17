const Election = require("../../models/Election");

exports.getAll = async (req, res) => {
  try {
    const elections = await Election.getAll();
    res.status(200).json(elections);
  } catch (err) {
    res.status(500).json({ message: "Error getting elections" });
  }
};

exports.getAvaliable = async (req, res) => {
  try {
    const { region, city } = req.user;
    const date = new Date();
    const elections = await Election.getAvailable({ region, city, date });
    res.status(200).json(elections);
  } catch (err) {
    res.status(500).json({ message: "Error getting avaliable elections" });
  }
};

exports.getAllLocations = async (req, res) => {
  try {
    const regions = await Election.getAllRegions();
    const cities = await Election.getAllCities();
    res.status(200).json({ regions, cities });
  } catch (err) {
    res.status(500).json({ message: "Error getting locations" });
  }
};

exports.getReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Election.getDailyVotes(id);
    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: "Error getting votes report" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const election = await Election.getById(id);
    res.status(200).json(election);
  } catch (err) {
    res.status(500).json({ message: "Error getting election" });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    const { id } = req.params;
    const candidates = await Election.getCandidates(id);
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ message: "Error getting candidates" });
  }
};
