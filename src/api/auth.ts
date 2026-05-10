import { apiFetch } from "@/api/client";
import type { AuthSession } from "@/store/auth";

export const loginRequest = (email: string, password: string) =>
    apiFetch<AuthSession>("/auth/login", {
        method: "POST",
        body: { email, password },
        skipAuth: true,
    });

export const signupRequest = (name: string, email: string, password: string) =>
    apiFetch<AuthSession>("/auth/signup", {
        method: "POST",
        body: { name, email, password },
        skipAuth: true,
    });

export const logoutRequest = (refreshToken: string) =>
    apiFetch<void>("/auth/logout", {
        method: "POST",
        body: { refreshToken },
        skipAuth: true,
    });
