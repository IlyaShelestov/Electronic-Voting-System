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

router.post("/election", createElection);
router.delete("/election/:id", deleteElection);
router.post("/candidate", createCandidate);
router.post("/candidate/attach", attachCandidate);
router.delete("/candidate/:id", deleteCandidate);
router.put("/candidate/:id", updateCandidate);
router.post("/events/:id", createEvent);
router.delete("/events/:id", deleteEvent);
router.put("/events/:id", updateEvent);

module.exports = router;
