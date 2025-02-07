const express = require("express");
const router = express.Router();
const { getAll } = require("../controllers/eventsController");

router.get("/", getAll);

module.exports = router;
