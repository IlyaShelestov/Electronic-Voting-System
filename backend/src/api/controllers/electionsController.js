const Election = require("../../models/Election");
const { getRegionAndCity } = require("../../utils/tokenHelper");

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
    const { region, city } = getRegionAndCity(req);
    const date = new Date();
    const elections = await Election.getAvailable({ region, city, date });
    res.status(200).json(elections);
  } catch (err) {
    res.status(500).json({ message: "Error getting avaliable elections" });
  }
};
