const express = require("express");
const router = express.Router();
const {
  getAll,
  getAvaliable,
  getById,
} = require("../controllers/electionsController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, getAll);
router.get("/available", verifyToken, getAvaliable);
router.get("/:id", verifyToken, getById);

module.exports = router;
