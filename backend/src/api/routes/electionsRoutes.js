const express = require("express");
const router = express.Router();
const {
  getAll,
  getAvaliable,
  getById,
  getReport,
  getCandidates,
} = require("../controllers/electionsController");

router.get("/", getAll);
router.get("/avaliable", getAvaliable);
router.get("/:id/report", getReport);
router.get("/:id/candidates", getCandidates);
router.get("/:id", getById);

module.exports = router;
