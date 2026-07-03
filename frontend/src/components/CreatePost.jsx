import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../services/AuthContext";
import { getAvatarColor } from "../services/utils";
import "../styles/components.css";

export default function CreatePost({ onPostCreated }) {
    const { user, showAlert } = useAuth();
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        if (content.length > 500) return; // Prevent posting beyond 500

        setSubmitting(true);
        try {
            await api.post("/posts", { content: content.trim() });
            setContent("");
            showAlert("Post Created", "success");
            if (onPostCreated) {
                onPostCreated();
            }
        } catch (err) {
            console.error(err);
            showAlert(err.response?.data?.message || "Failed to create post", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const initial = user?.username ? user.username.slice(0, 1).toUpperCase() : "?";
    const avatarBg = user?.username ? getAvatarColor(user.username) : "var(--primary-color)";

    const getCounterClass = () => {
        const len = content.length;
        if (len <= 450) return "counter-gray";
        if (len <= 490) return "counter-orange";
        return "counter-red";
    };

    return (
        <div className="card create-post-card">
            <div className="create-post-container">
                <div
                    className="create-post-avatar"
                    title={user?.username}
                    style={{ backgroundColor: avatarBg }}
                >
                    {initial}
                </div>
                <form onSubmit={handleSubmit} className="create-post-form">
                    <textarea
                        className="create-post-textarea"
                        placeholder="Share something with the world today..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        maxLength={500}
                        disabled={submitting}
                    />
                    <div className="create-post-footer">
                        <span className={`char-counter ${getCounterClass()}`}>
                            {content.length}/500
                        </span>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting || !content.trim()}
                        >
                            {submitting ? "Posting..." : "🚀 Create Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

