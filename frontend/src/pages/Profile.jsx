import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../services/AuthContext";
import PostCard from "../components/PostCard";
import SkeletonLoader from "../components/SkeletonLoader";
import { getAvatarColor } from "../services/utils";
import "../styles/global.css";
import "../styles/pages.css";

export default function Profile() {
  const { id: profileId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, refetchUser, showAlert, searchQuery } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProfileAndPosts = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile User details
      const profileRes = await api.get(`/users/profile/${profileId}`);
      setProfileUser(profileRes.data);

      // 2. Fetch all posts and filter by this user
      const postsRes = await api.get("/posts");
      const filtered = postsRes.data.filter(
        (post) => post.user?._id === profileId || post.user === profileId
      );
      setUserPosts(filtered);
    } catch (err) {
      console.error(err);
      showAlert("Failed to load profile details", "error");
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndPosts();
  }, [profileId]);

  const isOwnProfile = currentUser && currentUser._id === profileId;

  // Check if current user is following the profile user
  const isFollowing =
    currentUser &&
    profileUser &&
    profileUser.followers.some((f) => {
      const followerId = f._id || f;
      return followerId === currentUser._id;
    });

  const handleFollowToggle = async () => {
    if (!currentUser) {
      showAlert("You must be logged in to follow users", "error");
      return;
    }
    if (actionLoading) return;
    setActionLoading(true);

    const originalUser = { ...profileUser };
    const alreadyFollowing = isFollowing;

    // Instant/Optimistic update to counts (Requirement 4)
    let newFollowers;
    if (alreadyFollowing) {
      // Unfollowing: Filter out currently logged-in user
      newFollowers = profileUser.followers.filter(
        (f) => (f._id || f) !== currentUser._id
      );
    } else {
      // Following: Add currently logged-in user placeholder
      newFollowers = [
        ...profileUser.followers,
        { _id: currentUser._id, username: currentUser.username },
      ];
    }

    setProfileUser({
      ...profileUser,
      followers: newFollowers,
    });

    try {
      if (alreadyFollowing) {
        // Unfollow
        await api.put(`/users/unfollow/${profileId}`);
        showAlert("User Unfollowed", "info"); // Success Feedback Toast
      } else {
        // Follow
        await api.put(`/users/follow/${profileId}`);
        showAlert("User Followed", "follow"); // Success Feedback Toast
      }

      // Keep AuthContext user record synchronized with following lists
      await refetchUser();

      // Refetch profile user details from server to keep model completely synchronous
      const res = await api.get(`/users/profile/${profileId}`);
      setProfileUser(res.data);
    } catch (err) {
      // Rollback
      setProfileUser(originalUser);
      console.error(err);
      showAlert(
        err.response?.data?.message || "Failed to complete follow/unfollow action",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Switch to Skeleton view elements
  if (loading) {
    return (
      <div className="profile-layout">
        <SkeletonLoader type="profile" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="text-center page-container">
        <h2>User profile not found</h2>
        <button onClick={() => navigate("/home")} className="btn btn-primary mt-4">
          Back to Feed
        </button>
      </div>
    );
  }

  // Filter posts dynamics while typing (Requirement 6)
  const filteredPosts = userPosts.filter((post) => {
    const query = searchQuery ? searchQuery.toLowerCase().trim() : "";
    if (!query) return true;
    const authorName = profileUser?.username || "";
    const content = post.content || "";
    return authorName.toLowerCase().includes(query) || content.toLowerCase().includes(query);
  });

  const initial = profileUser.username.slice(0, 1).toUpperCase();
  const avatarBg = getAvatarColor(profileUser.username);

  return (
    <div className="profile-layout">
      {/* Profile Header Detail Card */}
      <div className="profile-card">
        <div className="profile-header-bg"></div>
        <div className="profile-content">
          {/* Requirement 7: Letter avatar background, shadow & size */}
          <div className="profile-avatar-big">
            <div className="avatar-inner" style={{ backgroundColor: avatarBg }}>
              {initial}
            </div>
          </div>

          <h1 className="profile-name">{profileUser.username}</h1>
          <p className="profile-email">{profileUser.email}</p>

          <p className={`profile-bio ${!profileUser.bio ? "empty" : ""}`}>
            {profileUser.bio || "No bio has been added by this user yet."}
          </p>

          <div className="profile-stats-row">
            <div className="stat-item">
              <span className="stat-value">{profileUser.followers.length}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{profileUser.following.length}</span>
              <span className="stat-label">Following</span>
            </div>
            {/* Requirement 3: Total posts count */}
            <div className="stat-item">
              <span className="stat-value">{userPosts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
          </div>

          {/* Requirement 3: If visiting another user's profile, show Follow/Unfollow button */}
          {!isOwnProfile && currentUser && (
            <div className="profile-actions">
              <button
                onClick={handleFollowToggle}
                className={`btn profile-action-btn-follow ${isFollowing ? "btn-outline" : "btn-primary"
                  }`}
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : isFollowing ? "🤝 Unfollow" : "➕ Follow"}
              </button>
            </div>
          )}

          {isOwnProfile && (
            <span className="profile-badge-own">
              This is your profile
            </span>
          )}
        </div>
      </div>

      {/* Profile Feed Section */}
      <div>
        <h2 className="profile-posts-title">
          <span>Publications</span>
          <span className="profile-posts-count">{filteredPosts.length}</span>
        </h2>

        {filteredPosts.length === 0 ? (
          /* Requirement 10: Empty State */
          <div className="empty-state">
            <span className="empty-state-icon">📝</span>
            <p className="empty-state-text">
              {searchQuery
                ? "No matching posts found."
                : "No posts published yet."}
            </p>
            <p className="empty-state-sub">
              {isOwnProfile && !searchQuery
                ? "Go ahead and create your first post!"
                : ""}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onRefresh={fetchProfileAndPosts}
            />
          ))
        )}
      </div>
    </div>
  );
}
