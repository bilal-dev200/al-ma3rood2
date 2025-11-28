import axiosClient from "./axiosClient";
import { useAuthStore } from "../../lib/stores/authStore";

export const authApi = {
  login: (credentials) => axiosClient.post("/user/login", credentials),
  register: (userData) => axiosClient.post("/user/register", userData),
  logout: () => axiosClient.post("/user/logout"),
  // Verification
  checkusername: (payload) => axiosClient.post("user/username-check", payload),
  verifyuser: (payload) => axiosClient.post("user/email-verification", payload),
  // ✅ Forgot & Reset Password
  forgotPassword: (email) =>
    axiosClient.post("/forgot-password", { email, from: "web" }),
  resetPassword: (data) => axiosClient.post("/user/reset-password", data),
};

export const setAuthToken = (token) => {
  // if (typeof window !== "undefined") {
  //   localStorage.setItem("token", token);
  // }

  // // Set cookie with Secure and SameSite=None for production
  // document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=None; Secure`;
   if (typeof window !== "undefined") {
    if (token) {
      // Save token with expiry (24 hours)
      const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24h
      // const expiryTime = new Date().getTime() + 1 * 60 * 1000; // 1 min for testing
      localStorage.setItem("token", token);
      localStorage.setItem("token_expiry", expiryTime.toString());
    } else {
      // 🚫 If no token, clear everything
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiry");
      localStorage.removeItem("auth-storage");
    }
  }

  // ✅ Set or clear cookie
  if (token) {
    document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=None; Secure`;
  } else {
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export const removeAuthToken = () => {
   if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("auth-storage"); 
  }
  try {
    const store = useAuthStore.getState();
    if (store?.clearAuth) store.clearAuth();
  } catch {}
  document.cookie =
    "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("token_expiry");
  if (!token || !expiry || new Date().getTime() > parseInt(expiry, 10)) {
    // Auto cleanup if token missing
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("auth-storage"); 
  }
  return token;
};