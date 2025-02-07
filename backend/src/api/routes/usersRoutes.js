const express = require("express");
const router = express.Router();
const {
  getProfileInfo,
  requestChange,
} = require("../controllers/usersController");

router.get("/me", getProfileInfo);
router.get("/me/request-change", requestChange);

module.exports = router;
