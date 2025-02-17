const express = require("express");
const router = express.Router();
const {
  castVote,
  checkVoted,
  checkVoteLocation,
  checkVoteToken,
} = require("../controllers/voteController");

router.post("/cast", castVote);
router.get("/status/:electionId", checkVoted);
router.get("/location/:electionId", checkVoteLocation);
router.post("/token", checkVoteToken);

module.exports = router;
