import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../services/AuthContext";
import { formatRelativeTime, getAvatarColor } from "../services/utils";
import "../styles/components.css";

export default function CommentBox({ postId, onCommentAdded }) {
    const { showAlert } = useAuth();
    const [comments, setComments] = useState([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/comments/${postId}`);
            setComments(res.data);
        } catch (err) {
            console.error("Failed to load comments", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        setSubmitting(true);
        try {
            await api.post("/comments", {
                postId,
                text: inputText.trim(),
            });
            setInputText("");
            showAlert("Comment Added", "comment"); // Toast Alert "Comment Added" (Requirement 8)
            await fetchComments(); // Refresh only comments (Requirement 2)
            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (err) {
            console.error(err);
            showAlert(err.response?.data?.message || "Failed to add comment", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="comment-section-wrapper">
            <form onSubmit={handleSubmit} className="comment-input-area">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="comment-input"
                    required
                    disabled={submitting}
                />
                {/* Requirement 2: Post Comment button */}
                <button
                    type="submit"
                    className="btn btn-primary btn-comment-submit"
                    disabled={submitting || !inputText.trim()}
                >
                    {submitting ? "Adding..." : "Post Comment"}
                </button>
            </form>

            {/* Requirement 9: Loading Placeholder for comments */}
            {loading ? (
                <div className="skeleton-comments-list">
                    <div className="skeleton-comment-item skeleton-pulse">
                        <div className="skeleton-comment-avatar"></div>
                        <div className="skeleton-comment-content">
                            <div className="skeleton-comment-meta"></div>
                            <div className="skeleton-comment-text"></div>
                        </div>
                    </div>
                    <div className="skeleton-comment-item skeleton-pulse">
                        <div className="skeleton-comment-avatar"></div>
                        <div className="skeleton-comment-content">
                            <div className="skeleton-comment-meta"></div>
                            <div className="skeleton-comment-text"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="comment-list">
                    {comments.length === 0 ? (
                        /* Requirement 10: No comments yet */
                        <p className="empty-comments-label">No comments yet.</p>
                    ) : (
                        comments.map((comment) => {
                            const commentAuthor = comment.user?.username || "Deleted User";
                            const initial = commentAuthor.slice(0, 1).toUpperCase();
                            const avatarBg = getAvatarColor(commentAuthor);

                            return (
                                <div key={comment._id} className="comment-item">
                                    {/* Requirement 7/2: Letter avatar background, shadow & size */}
                                    <div
                                        className="comment-avatar"
                                        style={{ backgroundColor: avatarBg }}
                                        title={commentAuthor}
                                    >
                                        {initial}
                                    </div>
                                    <div className="comment-content">
                                        <div className="comment-header-row">
                                            <span className="comment-user">{commentAuthor}</span>
                                            {/* Requirement 2: Comment timestamp */}
                                            <span className="comment-time">
                                                {formatRelativeTime(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="comment-text">{comment.text}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
