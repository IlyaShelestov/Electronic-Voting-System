const express = require("express");
const router = express.Router();
const {
  getCityById,
  getRegionById,
  getAllCities,
  getAllRegions,
} = require("../controllers/locationsController");

router.get("/cities", getAllCities);
router.get("/regions", getAllRegions);
router.get("/cities/:id", getCityById);
router.get("/regions/:id", getRegionById);

module.exports = router;
