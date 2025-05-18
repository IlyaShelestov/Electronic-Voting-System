const express = require("express");
const router = express.Router();
const { getAll, getByIIN } = require("../controllers/citizenController");

router.get("/", getAll);
router.get("/:iin", getByIIN);

module.exports = router;
