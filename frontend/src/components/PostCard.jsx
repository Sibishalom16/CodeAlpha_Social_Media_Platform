import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../services/AuthContext";
import CommentBox from "./CommentBox";
import { formatRelativeTime, getAvatarColor } from "../services/utils";
import "../styles/components.css";

export default function PostCard({ post, onRefresh }) {
    const { user: currentUser, showAlert } = useAuth();
    const navigate = useNavigate();
    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [likeLoading, setLikeLoading] = useState(false);

    // Maintain local likes list for instantaneous, no-reload updates
    const [likes, setLikes] = useState(post.likes || []);

    useEffect(() => {
        setLikes(post.likes || []);
    }, [post.likes]);

    const author = post.user || { username: "Guest User", _id: "" };
    const hasLiked = currentUser && likes.includes(currentUser._id);

    // Fetch the count of comments of this post
    const fetchCommentCount = async () => {
        try {
            const res = await api.get(`/comments/${post._id}`);
            setCommentCount(res.data.length);
        } catch (err) {
            console.error("Failed to load comment count", err);
        }
    };

    useEffect(() => {
        fetchCommentCount();
    }, [post._id]);

    const handleLikeToggle = async () => {
        if (!currentUser) {
            showAlert("You must be logged in to like posts", "error");
            return;
        }
        if (likeLoading) return;

        setLikeLoading(true);

        // Optimistic Update
        const bAlreadyLiked = likes.includes(currentUser._id);
        let updatedLikes = [];
        if (bAlreadyLiked) {
            updatedLikes = likes.filter((id) => id !== currentUser._id);
        } else {
            updatedLikes = [...likes, currentUser._id];
        }
        setLikes(updatedLikes);

        try {
            const res = await api.put(`/posts/${post._id}/like`);
            if (res.data && res.data.likes) {
                setLikes(res.data.likes);
            }

            // Toast notifications
            if (!bAlreadyLiked) {
                showAlert("Post Liked", "like");
            } else {
                showAlert("Post Unliked", "info");
            }

            // Notify parent to sync state in other pages (if needed) but update count locally first
            if (onRefresh) {
                onRefresh();
            }
        } catch (err) {
            // Rollback on failure
            setLikes(post.likes || []);
            console.error(err);
            showAlert(err.response?.data?.message || "Failed to submit like", "error");
        } finally {
            setLikeLoading(false);
        }
    };

    const handleUserClick = () => {
        if (author._id) {
            navigate(`/profile/${author._id}`);
        }
    };

    const handleCommentAdded = () => {
        fetchCommentCount();
        if (onRefresh) {
            onRefresh();
        }
    };

    return (
        <div className="card post-card">
            <div className="post-header">
                <div className="post-author-info">
                    <div
                        className="post-avatar"
                        onClick={handleUserClick}
                        style={{ backgroundColor: getAvatarColor(author.username) }}
                    >
                        {author.username.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="post-author-meta">
                        <span className="post-author-name" onClick={handleUserClick}>
                            {author.username}
                        </span>
                        <span className="post-time">{formatRelativeTime(post.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="post-content">{post.content}</div>

            {/* Modern Likes and Comments counts row */}
            <div className="post-stats-summary">
                <span className="post-stat-likes">
                    ❤️ {likes.length} {likes.length === 1 ? "Like" : "Likes"}
                </span>
                <span className="post-stat-comments" onClick={() => setShowComments(!showComments)}>
                    💬 {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                </span>
            </div>

            <div className="post-actions">
                {/* Requirement 1: Show "👍 Like" / "❤️ Liked" */}
                <button
                    onClick={handleLikeToggle}
                    className={`btn-action ${hasLiked ? "liked" : ""}`}
                    disabled={likeLoading}
                >
                    {hasLiked ? "❤️ Liked" : "👍 Like"}
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className={`btn-action ${showComments ? "active" : ""}`}
                >
                    💬 Comments
                </button>
            </div>

            {showComments && (
                <CommentBox
                    postId={post._id}
                    onCommentAdded={handleCommentAdded}
                    postAuthorName={author.username}
                />
            )}
        </div>
    );
}

