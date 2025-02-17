const express = require("express");
const router = express.Router();
const {
  getAll,
  getAvaliable,
  getById,
  getReport,
  getCandidates,
  getAllLocations,
} = require("../controllers/electionsController");

router.get("/", getAll);
router.get("/locations", getAllLocations);
router.get("/available", getAvaliable);
router.get("/:id/report", getReport);
router.get("/:id/candidates", getCandidates);
router.get("/:id", getById);

module.exports = router;
