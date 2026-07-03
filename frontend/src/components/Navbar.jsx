import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { getAvatarColor } from "../services/utils";
import "../styles/components.css";

export default function Navbar() {
    const { user, logout, theme, setTheme, searchQuery, setSearchQuery } = useAuth();
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmLogout = () => {
        setShowConfirm(false);
        logout();
        navigate("/login");
    };

    const handleCancelLogout = () => {
        setShowConfirm(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        // Automatically redirect to home if typing while on some other helper routes
        if (
            window.location.pathname !== "/home" &&
            !window.location.pathname.startsWith("/profile/")
        ) {
            navigate("/home");
        }
    };

    // If user is not loaded yet, don't show navbar
    if (!user) return null;

    return (
        <nav className="navbar-wrapper">
            <div className="container navbar">
                <div className="nav-left">
                    <Link to="/home" className="logo" onClick={() => setSearchQuery("")}>
                        <span>🌐</span> MiniSocial
                    </Link>
                </div>

                {/* Dynamic Search Bar (Works on Username and/or Post Content) */}
                <div className="nav-center">
                    <div className="search-bar-container">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search user or posts..."
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="nav-right">
                    <div
                        className="nav-user-avatar"
                        onClick={() => navigate(`/profile/${user._id}`)}
                        title="Go to Profile"
                        style={{ backgroundColor: getAvatarColor(user.username) }}
                    >
                        {user.username.slice(0, 1).toUpperCase()}
                    </div>

                    <div className="nav-user-info-text">
                        <span
                            className="nav-username clickable-user"
                            onClick={() => navigate(`/profile/${user._id}`)}
                        >
                            {user.username}
                        </span>
                    </div>

                    <div className="nav-actions">
                        {/* Custom Theme Selector */}
                        <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="theme-selector-navbar"
                            title="Change Theme Color"
                        >
                            <option value="blue">💙 Blue Theme</option>
                            <option value="indigo">💜 Indigo Theme</option>
                            <option value="emerald">💚 Emerald Theme</option>
                            <option value="sunset">🧡 Sunset Theme</option>
                            <option value="dark">🖤 Dark Theme</option>
                        </select>

                        <button
                            onClick={() => navigate(`/profile/${user._id}`)}
                            className="btn btn-secondary btn-nav-action"
                        >
                            👤 Profile
                        </button>
                        <button
                            onClick={handleLogoutClick}
                            className="btn btn-outline btn-nav-action"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </div>

            {showConfirm && (
                <div className="modal-backdrop">
                    <div className="custom-modal">
                        <div className="modal-header">
                            <h3>Confirm Logout</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to log out of your MiniSocial account?</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleCancelLogout} className="btn btn-outline">
                                Cancel
                            </button>
                            <button onClick={handleConfirmLogout} className="btn btn-danger">
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

