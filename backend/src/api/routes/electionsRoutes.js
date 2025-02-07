const express = require("express");
const router = express.Router();
const {
  getAll,
  getAvaliable,
  getById,
  getReport,
  getCandidates,
} = require("../controllers/electionsController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, getAll);
router.get("/available", verifyToken, getAvaliable);
router.get("/:id/report", verifyToken, getReport);
router.get("/:id/candidates", verifyToken, getCandidates);
router.get("/:id", verifyToken, getById);

module.exports = router;
