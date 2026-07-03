import React from "react";
import "../styles/components.css";

export default function Loader({ fullPage = false, message = "Loading..." }) {
    if (fullPage) {
        return (
            <div className="loader-overlay">
                <div className="loader-container">
                    <div className="spinner"></div>
                    {message && <p className="loader-message">{message}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="loader-container inline">
            <div className="spinner sm"></div>
            {message && <p className="loader-message sm">{message}</p>}
        </div>
    );
}
