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

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Election.getDailyVotes(id);
    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: "Error getting votes report" });
  }
};
