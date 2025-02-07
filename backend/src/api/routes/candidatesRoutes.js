const express = require("express");
const router = express.Router();
const { getById, getAll } = require("../controllers/candidatesController");

router.get("/", getAll);
router.get("/:id", getById);

module.exports = router;
