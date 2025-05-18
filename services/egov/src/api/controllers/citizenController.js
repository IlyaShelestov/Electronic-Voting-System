const Citizen = require("../../models/Citizen");

exports.getAll = async (req, res) => {
  try {
    const citizens = await Citizen.getAll();
    res.status(200).json(citizens);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving citizens",
      error: err.message,
    });
  }
};

exports.getByIIN = async (req, res) => {
  try {
    const { iin } = req.params;
    const citizen = await Citizen.findByIIN(iin);
    res.status(200).json(citizen);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving citizen",
      error: err.message,
    });
  }
};
