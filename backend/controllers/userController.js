const User = require("../models/User");

const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (req.user === req.params.id) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    if (userToFollow.followers.includes(req.user)) {
      return res.status(400).json({
        message: "Already following",
      });
    }

    userToFollow.followers.push(req.user);

    const currentUser = await User.findById(req.user);

    currentUser.following.push(req.params.id);

    await userToFollow.save();
    await currentUser.save();

    res.status(200).json({
      message: "User Followed Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const unfollowUser = async (req, res) => {
  try {

    const userToUnfollow = await User.findById(req.params.id);

    const currentUser = await User.findById(req.user);

    userToUnfollow.followers =
      userToUnfollow.followers.filter(
        (id) => id.toString() !== req.user
      );

    currentUser.following =
      currentUser.following.filter(
        (id) => id.toString() !== req.params.id
      );

    await userToUnfollow.save();
    await currentUser.save();

    res.status(200).json({
      message: "User Unfollowed Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username")
      .populate("following", "username");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getProfile,
};