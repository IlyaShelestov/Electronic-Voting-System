const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const {
  preventLoggedIn,
  verifyToken,
} = require("../middlewares/authMiddleware");

router.post("/register", preventLoggedIn, register);
router.post("/login", preventLoggedIn, login);
router.post("/logout", verifyToken, logout);

module.exports = router;
