/**
 * Format timestamp relative to current local time.
 * E.g., "2 minutes ago", "Yesterday", "3 Jul"
 */
export const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    try {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;

        if (diffMs < 0) return "just now";

        const diffSecs = Math.floor(diffMs / 1000);
        if (diffSecs < 60) return "just now";

        const diffMins = Math.floor(diffSecs / 60);
        if (diffMins < 60) return `${diffMins} minutes ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) {
            return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
        }

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;

        // Otherwise show short date: 3 Jul
        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
    } catch (e) {
        return "";
    }
};

/**
 * Return a deterministic background color based on username hash.
 * Same username always gets the same color background.
 */
export const getAvatarColor = (username) => {
    if (!username) return "#2563eb";
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Curated harmonious colors matching modern themes
    const colors = [
        "#3b82f6", // Blue
        "#6366f1", // Indigo
        "#8b5cf6", // Violet
        "#ec4899", // Pink
        "#f43f5e", // Rose
        "#f97316", // Orange
        "#10b981", // Emerald
        "#14b8a6", // Teal
        "#06b6d4"  // Cyan
    ];
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};
