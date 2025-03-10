const City = require("../../models/City");
const Region = require("../../models/Region");

exports.getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await City.getById(id);
    res.status(200).json(city);
  } catch (err) {
    res.status(500).json({ message: "Error getting city" });
  }
};

exports.getRegionById = async (req, res) => {
  try {
    const { id } = req.params;
    const region = await Region.getById(id);
    res.status(200).json(region);
  } catch (err) {
    res.status(500).json({ message: "Error getting region" });
  }
};

exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.getAll();
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ message: "Error getting cities" });
  }
};

exports.getAllRegions = async (req, res) => {
  try {
    const regions = await Region.getAll();
    res.status(200).json(regions);
  } catch (err) {
    res.status(500).json({ message: "Error getting regions" });
  }
};
