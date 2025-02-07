const express = require("express");
const router = express.Router();
const {
  createElection,
  deleteElection,
  createCandidate,
  deleteCandidate,
  updateCandidate,
  attachCandidate,
} = require("../controllers/analystController");

router.post("/election", createElection);
router.delete("/election/:id", deleteElection);
router.post("/candidate", createCandidate);
router.post("/candidate/attach", attachCandidate);
router.delete("/candidate/:id", deleteCandidate);
router.put("/candidate/:id", updateCandidate);

module.exports = router;
