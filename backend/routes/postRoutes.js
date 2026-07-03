const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createPost,
  getPosts,
  likePost,
} = require("../controllers/postController");

router.post("/", protect, createPost);

router.get("/", getPosts);

router.put("/:id/like", protect, likePost);

router.put("/test", (req, res) => {
  res.json({ message: "Like route working" });
});

module.exports = router;