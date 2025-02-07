const express = require("express");
const router = express.Router();
const { castVote, checkVoted } = require("../controllers/voteController");

router.post("/cast", castVote);
router.get("/status/:electionId", checkVoted);

module.exports = router;
