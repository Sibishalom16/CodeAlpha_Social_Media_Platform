import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import Loader from "./Loader";
import Navbar from "./Navbar";

export default function ProtectedRoute({ children }) {
    const { token, loading } = useAuth();

    if (loading) {
        return <Loader fullPage={true} message="Loading your workspace..." />;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Navbar />
            <div className="container page-container">
                {children}
            </div>
        </>
    );
}
