const express = require("express");
const router = express.Router();
const {
  getAll,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");

router.get("/users", getAll);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
