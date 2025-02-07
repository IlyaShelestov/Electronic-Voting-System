const express = require("express");
const router = express.Router();
const {
  createElection,
  deleteElection,
  createCandidate,
  deleteCandidate,
  updateCandidate,
  attachCandidate,
  createEvent,
  deleteEvent,
  updateEvent,
} = require("../controllers/managerController");

router.post("/elections", createElection);
router.delete("/elections/:id", deleteElection);
router.post("/candidates", createCandidate);
router.post("/candidates/attach", attachCandidate);
router.delete("/candidates/:id", deleteCandidate);
router.put("/candidates/:id", updateCandidate);
router.post("/events/:id", createEvent);
router.delete("/events/:id", deleteEvent);
router.put("/events/:id", updateEvent);

module.exports = router;
