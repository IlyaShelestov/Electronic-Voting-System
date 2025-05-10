const express = require("express");
const router = express.Router();
const {
  getProfileInfo,
  requestChange,
  getUserRequests,
} = require("../controllers/usersController");

router.get("/me", getProfileInfo);
router.post("/me/request-change", requestChange);
router.get("/me/requests", getUserRequests);

module.exports = router;
