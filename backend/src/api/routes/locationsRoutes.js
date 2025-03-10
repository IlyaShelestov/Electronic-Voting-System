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
router.get("/city/:id", getCityById);
router.get("/region/:id", getRegionById);

module.exports = router;
