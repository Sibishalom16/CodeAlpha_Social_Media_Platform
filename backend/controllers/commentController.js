const Comment = require("../models/Comment");

const addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    const comment = await Comment.create({
      post: postId,
      user: req.user,
      text,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    }).populate("user", "username");

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addComment,
  getComments,
};