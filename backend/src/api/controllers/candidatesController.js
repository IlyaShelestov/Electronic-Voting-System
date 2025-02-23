const Candidate = require("../../models/Candidate");

exports.getAll = async (req, res) => {
  try {
    const candidates = await Candidate.getAll();
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ message: "Error getting candidates" });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const candidate = await Candidate.getById(id);
    res.status(200).json(candidate);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error getting candidate" });
  }
};
