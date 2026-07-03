import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./api";

const AuthContext = createContext(null);

export const decodeToken = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split("")
                .map((c) => {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [theme, setThemeState] = useState(localStorage.getItem("theme") || "blue");
    const [searchQuery, setSearchQuery] = useState("");

    const setTheme = (newTheme) => {
        localStorage.setItem("theme", newTheme);
        setThemeState(newTheme);
    };

    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    const showAlert = (message, type = "success") => {
        setAlert({ message, type });
        setTimeout(() => {
            setAlert(null);
        }, 4000);
    };

    const fetchUserProfile = async (userId) => {
        try {
            const res = await api.get(`/users/profile/${userId}`);
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch user profile", err);
            logout(false); // Clear invalid token
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            const decoded = decodeToken(token);
            if (decoded && decoded.id) {
                fetchUserProfile(decoded.id);
            } else {
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
                setLoading(false);
            }
        } else {
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        showAlert("Logged in successfully!", "success");
    };

    const logout = (showNotification = true) => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        if (showNotification) {
            showAlert("Logged out successfully!", "info");
        }
    };

    const refetchUser = async () => {
        if (token) {
            const decoded = decodeToken(token);
            if (decoded && decoded.id) {
                try {
                    const res = await api.get(`/users/profile/${decoded.id}`);
                    setUser(res.data);
                } catch (err) {
                    console.error("Fail to refetch profile", err);
                }
            }
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                alert,
                showAlert,
                login,
                logout,
                refetchUser,
                theme,
                setTheme,
                searchQuery,
                setSearchQuery,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
