import React from "react";
import "../styles/components.css";

export default function SkeletonLoader({ type = "post", count = 3 }) {
    const renderPostSkeleton = (index) => (
        <div key={index} className="skeleton-card card">
            <div className="skeleton-header">
                <div className="skeleton-avatar skeleton-pulse"></div>
                <div className="skeleton-meta">
                    <div className="skeleton-line skeleton-title skeleton-pulse"></div>
                    <div className="skeleton-line skeleton-subtitle skeleton-pulse"></div>
                </div>
            </div>
            <div className="skeleton-body">
                <div className="skeleton-line skeleton-pulse"></div>
                <div className="skeleton-line skeleton-pulse" style={{ width: "90%" }}></div>
                <div className="skeleton-line skeleton-pulse" style={{ width: "75%" }}></div>
            </div>
            <div className="skeleton-actions">
                <div className="skeleton-btn skeleton-pulse"></div>
                <div className="skeleton-btn skeleton-pulse"></div>
            </div>
        </div>
    );

    const renderProfileSkeleton = () => (
        <div className="skeleton-profile-card">
            <div className="skeleton-profile-bg skeleton-pulse"></div>
            <div className="skeleton-profile-content">
                <div className="skeleton-profile-avatar skeleton-pulse"></div>
                <div className="skeleton-profile-line skeleton-pulse" style={{ width: "150px", height: "24px", margin: "16px auto 8px" }}></div>
                <div className="skeleton-profile-line skeleton-pulse" style={{ width: "200px", height: "16px", margin: "0 auto 16px" }}></div>
                <div className="skeleton-profile-bio skeleton-pulse"></div>
                <div className="skeleton-profile-stats">
                    <div className="skeleton-stat-item skeleton-pulse"></div>
                    <div className="skeleton-stat-item skeleton-pulse"></div>
                </div>
            </div>
        </div>
    );

    const renderSidebarSkeleton = () => (
        <div className="sidebar-profile skeleton-sidebar">
            <div className="sidebar-avatar skeleton-pulse"></div>
            <div className="skeleton-line skeleton-pulse" style={{ width: "120px", height: "18px", margin: "8px 0" }}></div>
            <div className="skeleton-line skeleton-pulse" style={{ width: "160px", height: "14px", margin: "4px 0 16px" }}></div>
            <div className="sidebar-stats">
                <div className="stat-item" style={{ height: "40px", width: "50px" }}>
                    <div className="skeleton-line skeleton-pulse" style={{ height: "16px" }}></div>
                    <div className="skeleton-line skeleton-pulse" style={{ height: "12px", marginTop: "4px" }}></div>
                </div>
                <div className="stat-item" style={{ height: "40px", width: "50px" }}>
                    <div className="skeleton-line skeleton-pulse" style={{ height: "16px" }}></div>
                    <div className="skeleton-line skeleton-pulse" style={{ height: "12px", marginTop: "4px" }}></div>
                </div>
            </div>
            <div className="skeleton-btn skeleton-pulse" style={{ width: "100%", height: "38px", marginTop: "24px" }}></div>
        </div>
    );

    if (type === "profile") {
        return renderProfileSkeleton();
    }

    if (type === "sidebar") {
        return renderSidebarSkeleton();
    }

    return (
        <div className="skeleton-container">
            {Array.from({ length: count }).map((_, idx) => renderPostSkeleton(idx))}
        </div>
    );
}
