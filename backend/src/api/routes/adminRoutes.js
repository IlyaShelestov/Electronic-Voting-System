const express = require("express");
const router = express.Router();
const {
  getAll,
  createUser,
  updateUser,
  deleteUser,
  getAllRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
} = require("../controllers/adminController");

router.get("/users", getAll);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/requests", getAllRequests);
router.get("/requests/:id", getRequestById);
router.post("/requests/:id/approve", approveRequest);
router.post("/requests/:id/reject", rejectRequest);

module.exports = router;
