const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  followUser,
  unfollowUser,
  getProfile,
} = require("../controllers/userController");

router.put("/follow/:id", protect, followUser);

router.put("/unfollow/:id", protect, unfollowUser);

router.get("/profile/:id", getProfile);

module.exports = router;