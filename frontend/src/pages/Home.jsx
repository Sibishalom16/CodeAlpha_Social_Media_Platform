import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../services/AuthContext";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import SkeletonLoader from "../components/SkeletonLoader";
import { getAvatarColor } from "../services/utils";
import "../styles/global.css";
import "../styles/pages.css";

export default function Home() {
  const { user: currentUser, searchQuery } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Calculate this user's total posts count dynamically from the entire feed
  const userPostsCount = posts.filter(
    (post) => post.user?._id === currentUser?._id || post.user === currentUser?._id
  ).length;

  // Filter posts dynamics while typing (Requirement 6)
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery ? searchQuery.toLowerCase().trim() : "";
    if (!query) return true;
    const authorName = post.user?.username || "";
    const content = post.content || "";
    return authorName.toLowerCase().includes(query) || content.toLowerCase().includes(query);
  });

  return (
    <div className="home-layout">
      {/* Sidebar Profile Card */}
      <aside className="sidebar-profile">
        {currentUser ? (
          <>
            {/* Requirement 7: Letter avatar background, shadow & size */}
            <div
              className="sidebar-avatar clickable-user"
              onClick={() => navigate(`/profile/${currentUser._id}`)}
              title="Go to Profile"
              style={{ backgroundColor: getAvatarColor(currentUser.username) }}
            >
              {currentUser.username.slice(0, 1).toUpperCase()}
            </div>
            <h2
              className="sidebar-name clickable-user"
              onClick={() => navigate(`/profile/${currentUser._id}`)}
            >
              {currentUser.username}
            </h2>
            <p className="sidebar-email">{currentUser.email}</p>

            <div className="sidebar-stats">
              <div className="stat-item">
                <span className="stat-value">
                  {currentUser.followers ? currentUser.followers.length : 0}
                </span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {currentUser.following ? currentUser.following.length : 0}
                </span>
                <span className="stat-label">Following</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{userPostsCount}</span>
                <span className="stat-label">Posts</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/profile/${currentUser._id}`)}
              className="btn btn-secondary sidebar-action-btn"
            >
              My Profile
            </button>
          </>
        ) : (
          <SkeletonLoader type="sidebar" />
        )}
      </aside>

      {/* Main Feed Column */}
      <section className="feed-column">
        {currentUser && <CreatePost onPostCreated={fetchPosts} />}

        <h2 className="feed-header-title">
          {searchQuery ? "Search Results" : "Recent Posts"}
        </h2>

        {loadingPosts ? (
          <SkeletonLoader count={3} />
        ) : filteredPosts.length === 0 ? (
          /* Requirement 10: Empty State */
          <div className="empty-state">
            <span className="empty-state-icon">📭</span>
            <p className="empty-state-text">
              {searchQuery
                ? "No matching posts found."
                : "No posts yet. Be the first to share something!"}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onRefresh={fetchPosts}
            />
          ))
        )}
      </section>
    </div>
  );
}