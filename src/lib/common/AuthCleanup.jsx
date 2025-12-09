"use client";
import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { removeAuthToken } from "../api/auth";

export default function AuthCleanup() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const expiry = localStorage.getItem("token_expiry");

      if (!token || !expiry || Date.now() > parseInt(expiry, 10)) {
        console.log("🕒 Token missing or expired — clearing auth...");
        removeAuthToken();
        clearAuth();
        // window.location.href = "/login";
      }
    };

    // ✅ Run immediately on mount
    checkAuth();

    // ✅ Re-check when user returns to tab (lightweight alternative)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAuth();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [clearAuth]);

  return null;
}
