const express = require("express");
const router = express.Router();
const { getAll, getAvaliable } = require("../controllers/electionsController");

router.get("/", getAll);
router.get("/available", getAvaliable);

module.exports = router;
